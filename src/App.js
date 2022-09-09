import logo from "./logo.svg";
import "./App.css";
import { useState } from 'react';
import QRCode from 'react-qr-code';

function App() {
    const { ethereum } = window;
    // const snapId = "npm:solanasnap2";
    const [value, setValue] = useState();
    const [back, setBack] = useState('#FFFFFF');
    const [fore, setFore] = useState('#000000');
    const [size, setSize] = useState(256);

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
        const hello1 = await ethereum.request({
            method: "wallet_invokeSnap",
            params: [
                'npm:solanasnap1',
                { method: "getPublicKey" },
            ],
        });
        setValue(hello1);
        console.log(hello);
        console.log(hello1);

    }
    return ( <div className = "App" >
        <button onClick = { something } > Hello </button> 
        <button onClick = { someWork } > Work </button>
        {value && (
          <QRCode
            title="Receive"
            value={value}
            bgColor={back}
            fgColor={fore}
            size={size === '' ? 0 : size}
          />
        )}
        </div>
    );
}

export default App;