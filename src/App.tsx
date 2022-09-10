import {useState} from 'react';
import QRCode from 'react-qr-code';
import {
    SystemProgram,
    PublicKey,
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    clusterApiUrl,
    Transaction
} from "@solana/web3.js";
import Home from "./components/home";

// connection
const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

function App() {
    // @ts-ignore
    const {ethereum} = window;
    // const snapId = "npm:solanasnap2";
    const [value, setValue] = useState({
        pubKey: "", balance: 0
    });
    const [back, setBack] = useState('#FFFFFF');
    const [fore, setFore] = useState('#000000');
    const [size, setSize] = useState(256);

    async function installSnap() {
        try {
            const result = await ethereum.request({
                method: 'wallet_enable',
                // This entire object is ultimately just a list of requested permissions.
                // Every snap has an associated permission or permissions, given the prefix `wallet_snap_`
                // and its ID. Here, the `wallet_snap` property exists so that callers don't
                // have to specify the full permission permission name for each snap.
                params: [{
                    wallet_snap: {
                        'npm:solanasnap1': {},
                    },
                    eth_accounts: {},
                },],
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

    async function connectToWallet() {
        const keypair = await ethereum.request({
            method: "wallet_invokeSnap",
            params: [
                'npm:solanasnap1',
                {method: "getPublicExtendedKey"},
            ],
        });
        const pubKey = await ethereum.request({
            method: "wallet_invokeSnap",
            params: [
                'npm:solanasnap1',
                {method: "getPublicKey"},
            ],
        });
        const bal = await connection.getBalance(new PublicKey(pubKey));

        let updatedValue = {};
        updatedValue = {pubKey: pubKey, balance: bal / LAMPORTS_PER_SOL};
        setValue(value => ({
            ...value,
            ...updatedValue
        }));

        console.log(keypair);
        console.log(pubKey);
        console.log(`${bal / LAMPORTS_PER_SOL} SOL`);

    }

    async function sendSol() {
        let tx = new Transaction();
        tx.add(
            SystemProgram.transfer({
                // @ts-ignore
                fromPubkey: value.pubKey,
                toPubkey: new PublicKey("GdNh12yVy5Lsew9WXVCV5ErgK5SpmsBJkcti5jVtPB7o"),
                lamports: 1 * LAMPORTS_PER_SOL,
            })
        );
        const send = await ethereum.request({
            method: "wallet_invokeSnap",
            params: [
                'npm:solanasnap1',
                {
                    method: "signTransaction",
                    params: tx
                },
            ],
        });
        console.log(send);
    }

    return (
        <div className="flex flex-col h-screen">
            <Home/>
            <button onClick={installSnap}> Install Snap</button>
            <button onClick={connectToWallet}> Connect</button>

            {(value.pubKey != "") && (
                <div>
                    <QRCode
                        title="Receive"
                        value={value.pubKey}
                        bgColor={back}
                        fgColor={fore}
                        size={size === null ? 0 : size}
                    />
                    <text id="sol">{value.balance} Sols</text>
                    <button onClick={sendSol}> Send Sol</button>
                </div>

            )}
        </div>
    );
}

export default App;