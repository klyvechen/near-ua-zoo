import './App.css';
import {
  BrowserRouter,
  Routes,
  Switch,
  Route,
  Link,
  NavLink
} from "react-router-dom";
import {Buffer} from 'buffer';
Buffer.from('anything','base64');
window.Buffer = window.Buffer || require("buffer").Buffer;

function Home() {
  return (
    <div className="App">
      <header className="App-header">

        <NavLink exact activeClassName="active" to="/ua-zoo"> UA ZOO </NavLink>
      
      </header>
    </div>
  );
}

export default Home;
