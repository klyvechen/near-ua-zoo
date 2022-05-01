import Home from './Home';
import UaZoo from './UaZoo';

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
          <Route path="/ua-zoo" element={<UaZoo/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
