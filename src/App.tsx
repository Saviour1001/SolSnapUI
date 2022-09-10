import "./index.css";
import Home from "./components/home";

function App() {
    // @ts-ignore
    const {ethereum} = window;

    async function someWork() {
        const hello = await ethereum.request({
            method: "wallet_invokeSnap",
            params: [
                'npm:solanasnap1',
                {method: "getPublicExtendedKey"},
            ],
        });

        console.log(hello);
    }

    return (<div className="flex flex-col h-screen">
            {    /** @ts-ignore **/}
            <Home/>
        </div>
    );
}

export default App;