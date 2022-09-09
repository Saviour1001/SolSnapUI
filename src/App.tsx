import "./App.css";

function App() {
    // @ts-ignore
    const {ethereum} = window;

    async function something() {
        try {
            const result = await ethereum.request({
                method: 'wallet_enable',
                params: [{
                    wallet_snap: {
                        'npm:solanasnap1': {},
                    },
                    eth_accounts: {},
                },],
            });
            console.log(result);

        } catch (error: any) {
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
                {method: "getPublicExtendedKey"},
            ],
        });

        console.log(hello);
    }

    return (<div className="App">
            <button onClick={something}> Hello</button>
            <button onClick={someWork}> Work</button>
        </div>
    );
}

export default App;