import "./App.css";

import Todolist from "./components/Todolist";
import Catfact from "./components/Catfact";
// import "./CSS/Todolist.css";
// import "./CSS/Catfact.css";
import Excusegen from "./components/Excusegen";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "./CSS/Excusegen.css";
import PitchDetector from "./components/PitchDetector";
import "./CSS/PitchDetector.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/todo" element={<Todolist />}></Route>
          <Route path="/catfact" element={<Catfact />}></Route>
          <Route path="/excuse" element={<Excusegen />}></Route>
          <Route path="/pitch" element={<PitchDetector />}></Route>
        </Routes>
      </Router>
      {/* <Todolist /> */}
      {/* <Catfact /> */}
    </div>
  );
}

export default App;
