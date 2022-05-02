import Home from './Home';
import UaZoo from './UaZoo';
import Market from './Market';

import './App.css';
import {
  BrowserRouter,
  Routes,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {Buffer} from 'buffer';
Buffer.from('anything','base64');
window.Buffer = window.Buffer || require("buffer").Buffer;

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UaZoo/>}></Route>
          <Route path="/mint" element={<UaZoo/>}></Route>
          <Route path="/market" element={<Market/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
