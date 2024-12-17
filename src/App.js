import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="App">
              <header className="App-header">
                <h1>Home</h1>
              </header>
            </div>
          }
        />
        <Route
          path="/about"
          element={
            <div className="App">
              <header className="App-header">
                <h1>About</h1>
              </header>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
