import logo from './logo.svg'
import './App.css'

import { WebSocketProvider } from './context/ws'
import { Chat } from './chat'


function App() {
  return (
    <WebSocketProvider>
      <div className="App">
        <header className="App-header">
          <Chat/>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </WebSocketProvider>
  );
}

export default App;
