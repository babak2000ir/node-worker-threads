import { ReactTerminal } from "react-terminal";
import './App.css';
function App() {
  async function myHandler() {
    var args = Array.prototype.slice.call(arguments);
    const settings = {
      method: 'POST',
      body: JSON.stringify({ commandString: args.join(' ') }),
      headers: {
        'Content-Type': 'application/json',
        "accepts": "application/json"
      }
    }
    return await fetch('/api', settings)
      .then(res => res.text())
      .then(text => {
        const responseArr = text.split('\n');
        return responseArr.map((response, idx) =>
          <><span key={idx}>{response}</span><br /></>
        );
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ height: 600, maxHeight: "100vh", width: '90%', maxWidth: "100vw" }}>
          <ReactTerminal defaultHandler={myHandler} theme="dark" />
        </div>
      </header>
    </div>
  );
}

export default App;
