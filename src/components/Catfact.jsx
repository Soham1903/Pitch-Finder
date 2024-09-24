import React, { useEffect, useState } from "react";
import Axios from "axios";

function Catfact() {
  const [catFact, setCatFact] = useState("");

  const getCatFact = () => {
    Axios.get("https://catfact.ninja/fact").then((res) => {
      setCatFact(res.data.fact);
    });
  };

  useEffect(() => {
    getCatFact();
  }, []);

  return (
    <div>
      <img
        src="https://em-content.zobj.net/source/apple/391/cat-face_1f431.png"
        alt="Cute Cat"
      />
      <h1>Cats Fact Generator</h1>
      <h4>{catFact}</h4>
      <button onClick={getCatFact}>Get Cat Fact</button>
    </div>
  );
}

export default Catfact;
