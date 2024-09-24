import "./App.css";

import Todolist from "./components/Todolist";
import Catfact from "./components/Catfact";
// import "./CSS/Todolist.css";
// import "./CSS/Catfact.css";
import Excusegen from "./components/Excusegen";
import "./CSS/Excusegen.css";

function App() {
  return (
    <div className="App">
      {/* <Todolist /> */}
      {/* <Catfact /> */}
      <Excusegen />
    </div>
  );
}

export default App;
