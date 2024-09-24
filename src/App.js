import "./App.css";

import Todolist from "./components/Todolist";
import Catfact from "./components/Catfact";
import "./CSS/Todolist.css";
import "./CSS/Catfact.css";

function App() {
  return (
    <div className="App">
      {/* <Todolist /> */}
      <Catfact />
    </div>
  );
}

export default App;
