import logo from "./logo.svg";
import "./App.css";

function App() {
  const { ethereum } = window;
  const snapId = "npm:solanasnap2";
  async function something() {
    const result = await ethereum.request({
      method: "wallet_enable",
      params: [
        {
          wallet_snap: { [snapId]: { version: "0.0.1" } },
        },
      ],
    });
    console.log(result);
  }
  async function someWork() {
    const hello = await ethereum.request({
      method: "wallet_invokeSnap",
      params: [
        "npm:@anamansari062/solanasnap2",
        { method: "getExtendedPublicKey" },
      ],
    });

    console.log(hello);
  }
  return (
    <div className="App">
      <button onClick={something}>Hello</button>
      <button onClick={someWork}>Work</button>
    </div>
  );
}

export default App;
