import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

function Excusegen() {
  const [excuse, setExcuse] = useState("");
  const familyexcuse = () => {
    axios("https://excuser-three.vercel.app/v1/excuse/family/").then((res) => {
      setExcuse(res.data[0].excuse);
    });
  };

  const collegeexcuse = () => {
    axios("https://excuser-three.vercel.app/v1/excuse/college/").then((res) => {
      setExcuse(res.data[0].excuse);
    });
  };

  const officeexcuse = () => {
    axios("https://excuser-three.vercel.app/v1/excuse/office/").then((res) => {
      setExcuse(res.data[0].excuse);
    });
  };

  const funnyexcuse = () => {
    axios("https://excuser-three.vercel.app/v1/excuse/office/").then((res) => {
      setExcuse(res.data[0].excuse);
    });
  };

  return (
    <div>
      <img
        src="https://em-content.zobj.net/source/apple/391/man-shrugging-medium-light-skin-tone_1f937-1f3fc-200d-2642-fe0f.png"
        alt="excuse-man"
      />
      <h1>Excuse Generator</h1>
      <h4>Select an option:</h4>
      <button onClick={familyexcuse}>Family</button>
      <button onClick={collegeexcuse}>College</button>
      <button onClick={officeexcuse}>Office</button>
      <button onClick={funnyexcuse}>Funny</button>
      <p>{excuse}</p>
    </div>
  );
}

export default Excusegen;
