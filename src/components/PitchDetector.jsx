import React, { useEffect, useRef, useState } from "react";

const PitchDetector = () => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPlayingMIDI, setIsPlayingMIDI] = useState(false);
  const [pitch, setPitch] = useState("--");
  const [westernNote, setWesternNote] = useState("-");
  const [indianNote, setIndianNote] = useState("-");
  const [frequency, setFrequency] = useState(null); // Initialize frequency as null
  const midiAccessRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamSourceRef = useRef(null);
  const rafID = useRef(null);
  const buflen = 2048;
  const buf = new Float32Array(buflen);

  // Indian Swaras
  const swaraStrings = [
    "सा",
    "रे_",
    "रे",
    "ग_",
    "ग",
    "म",
    "मे",
    "प",
    "ध_",
    "ध",
    "नि_",
    "नि",
  ];

  // Western Notes
  const noteStrings = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];

  const startMIDI = async () => {
    try {
      midiAccessRef.current = await navigator.requestMIDIAccess();
      midiAccessRef.current.inputs.forEach((input) => {
        input.onmidimessage = handleMIDIMessage;
      });
    } catch (error) {
      console.error("Failed to get MIDI access:", error);
    }
  };

  const handleMIDIMessage = (message) => {
    const [status, note, velocity] = message.data;

    // Check if it's a note on event (0x90) and velocity > 0
    if (status === 0x90 && velocity > 0) {
      const octave = Math.floor(note / 12) - 1;

      // Get the Western note
      const westernNoteName = noteStrings[note % 12];
      const westernNoteWithOctave = `${westernNoteName}${octave}`;
      setWesternNote(westernNoteWithOctave);

      // Get the Indian swara
      const indianSwaraName =
        westernNoteName === "C" ? " नि" : swaraStrings[(note % 12) - 1];
      const indianNoteWithOctave =
        westernNoteName === "C"
          ? `${indianSwaraName}${octave - 1}`
          : `${indianSwaraName}${octave}`;
      setIndianNote(indianNoteWithOctave);

      // Set pitch to note number for display
      setPitch(note);
      // Set frequency for display (assuming note frequency is known)
      setFrequency(440 * Math.pow(2, (note - 69) / 12)); // Frequency calculation
    }
  };

  const startAudio = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamSourceRef.current =
        audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      mediaStreamSourceRef.current.connect(analyserRef.current);
      updatePitch();
    } catch (error) {
      console.error("Error accessing audio devices:", error);
    }
  };

  const updatePitch = () => {
    if (!analyserRef.current) return;

    analyserRef.current.getFloatTimeDomainData(buf);
    const ac = autoCorrelate(buf, audioContextRef.current.sampleRate);

    if (ac === -1) {
      setPitch("--");
      setWesternNote("-");
      setIndianNote("-");
      setFrequency(null); // Reset frequency when no pitch is detected
    } else {
      const note = noteFromPitch(ac);
      if (note !== undefined) {
        const octave = Math.floor(note / 12) - 1;

        // Get the Western note
        const westernNoteName = noteStrings[note % 12];
        const westernNoteWithOctave = `${westernNoteName}${octave}`;
        setWesternNote(westernNoteWithOctave);

        // Get the Indian swara
        const indianSwaraName = swaraStrings[note % 12];
        const indianNoteWithOctave = `${indianSwaraName}${octave}`;
        setIndianNote(indianNoteWithOctave);

        // Set the frequency for display
        setFrequency(ac); // Set the frequency directly from auto-correlation result
      }
    }

    rafID.current = requestAnimationFrame(updatePitch);
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      cancelAnimationFrame(rafID.current);
      setIsPlayingAudio(false);
      if (mediaStreamSourceRef.current) {
        mediaStreamSourceRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null; // Reset audio context
      }
    } else {
      startAudio();
      setIsPlayingAudio(true);
    }
  };

  const handleToggleMIDI = () => {
    if (isPlayingMIDI) {
      setIsPlayingMIDI(false);
      if (midiAccessRef.current) {
        midiAccessRef.current.inputs.forEach((input) => {
          input.onmidimessage = null; // Unregister the handler
        });
      }
    } else {
      startMIDI();
      setIsPlayingMIDI(true);
    }
  };

  useEffect(() => {
    return () => {
      if (midiAccessRef.current) {
        midiAccessRef.current.inputs.forEach((input) => {
          input.onmidimessage = null; // Cleanup MIDI messages
        });
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Function to find the pitch using auto-correlation
  const autoCorrelate = (buf, sampleRate) => {
    let SIZE = buf.length;
    let rms = 0;
    for (let i = 0; i < SIZE; i++) {
      let val = buf[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return -1;

    let r1 = 0,
      r2 = SIZE - 1,
      thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++)
      if (Math.abs(buf[i]) < thres) {
        r1 = i;
        break;
      }
    for (let i = 1; i < SIZE / 2; i++)
      if (Math.abs(buf[SIZE - i]) < thres) {
        r2 = SIZE - i;
        break;
      }

    buf = buf.slice(r1, r2);
    SIZE = buf.length;

    const c = new Array(SIZE).fill(0);
    for (let i = 0; i < SIZE; i++)
      for (let j = 0; j < SIZE - i; j++) c[i] = c[i] + buf[j] * buf[j + i];

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxval = -1,
      maxpos = -1;
    for (let i = d; i < SIZE; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
    let T0 = maxpos;

    const x1 = c[T0 - 1],
      x2 = c[T0],
      x3 = c[T0 + 1];
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
  };

  // Function to convert frequency to note number
  const noteFromPitch = (frequency) => {
    const noteNumber = Math.round(
      12 * (Math.log(frequency / 440) / Math.log(2)) + 69
    );
    return noteNumber >= 0 ? noteNumber : undefined;
  };

  return (
    <div>
      <img src="https://em-content.zobj.net/source/apple/391/musical-notes_1f3b6.png" />
      <h1>Pitch Finder</h1>
      <div className="button-container">
        <button onClick={handleToggleAudio}>
          {isPlayingAudio ? "Stop Audio" : "Start Audio"}
        </button>
        <button onClick={handleToggleMIDI}>
          {isPlayingMIDI ? "Stop MIDI" : "Start MIDI"}
        </button>
      </div>
      <div id="detector">
        <div>
          <div id="western-note">
            <b>Western Note:</b> {westernNote}
          </div>
          <div id="indian-note">
            <b>Indian Swara:</b> {indianNote}
          </div>
        </div>
        <div>
          <div id="frequency">
            <b>Frequency:</b>{" "}
            {frequency !== null ? `${frequency.toFixed(2)} Hz` : ""}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PitchDetector;
