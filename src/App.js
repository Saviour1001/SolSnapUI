import logo from "./logo.svg";
import "./App.css";

function App() {
    const { ethereum } = window;
    // const snapId = "npm:solanasnap2";
    async function something() {
        try {
            const result = await ethereum.request({
                method: 'wallet_enable',
                // This entire object is ultimately just a list of requested permissions.
                // Every snap has an associated permission or permissions, given the prefix `wallet_snap_`
                // and its ID. Here, the `wallet_snap` property exists so that callers don't
                // have to specify the full permission permission name for each snap.
                params: [{
                    wallet_snap: {
                        'npm:solanasnap1': { },
                    },
                    eth_accounts: {},
                }, ],
            });
            console.log(result);

        } catch (error) {
            // The `wallet_enable` call will throw if the requested permissions are
            // rejected.
            if (error.code === 4001) {
                console.log('The user rejected the request.');
            } else {
                console.log('Unexpected error:', error);
            }
        }

        
    }
    async function someWork() {
        const hello = await ethereum.request({
            method: "wallet_invokeSnap",
            params: [
                'npm:solanasnap1',
                { method: "getPublicExtendedKey" },
            ],
        });

        console.log(hello);
    }
    return ( <div className = "App" >
        <button onClick = { something } > Hello </button> 
        <button onClick = { someWork } > Work </button> 
        </div>
    );
}

export default App;