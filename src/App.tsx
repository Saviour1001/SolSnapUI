import {useState} from 'react';
import QRCode from 'react-qr-code';
import "components/home.css"
import {FiSend} from "react-icons/fi";
import {enableWallet} from "api/enable_wallet";
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

var solana_logo = require("images/solana-logo.png")

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

    async function handleConnect() {
        installSnap();
        connectToWallet();
    }

    return (
    <div>
        <div className="w-full h-full flex justify-center align-center py-10">

            <div className="container w-1/2 p-10 text-white">
                <div className="flex flex-row justify-start items-center gap-5 mb-10">
                    <img src={solana_logo} className="w-20 h-20"/>
                    <h1 className="text-5xl font-semibold">SolanaSnap</h1>
                </div>
                <h2 className="text-2xl mb-3">Current Balance</h2>
                <h2 className="text-6xl font-bold mb-5">{value.balance} SOL</h2>
                <h1>Hello, Snaps!</h1>
                <details className="mb-10">
                    <summary>Instructions</summary>
                    <ul>
                        <li>First, click "Connect". Then, try out the other buttons!</li>
                        <li>Please note that:</li>
                        <ul>
                            <li>
                                The <code>snap.manifest.json</code> and <code>package.json</code> must be located in the
                                server root
                                directory...
                            </li>
                            <li>
                                The Snap bundle must be hosted at the location specified by
                                the <code>location</code> field of
                                <code>snap.manifest.json</code>.
                            </li>
                        </ul>
                    </ul>
                </details>
                <div className="flex flex-row gap-10">
                    <FiSend className="border-2 rounded-md p-2 border-sky-500 w-20 h-20"onClick={() => sendSol()}/>
                    <FiSend className="border-2 rounded-md p-2 border-sky-500 w-20 h-20 rotate-180"/>
                </div>
                <br/>
                {(value.pubKey != "") && (
                <div>
                    <QRCode
                        title="Receive"
                        value={value.pubKey}
                        bgColor={back}
                        fgColor={fore}
                        size={size === null ? 0 : size}
                    />
                </div>

            )}
            <br/>

                <div className="flex flex-row justify-start items-center gap-10 text-lg">
                    <button id="connect" className="btn btn-primary" onClick={() => handleConnect()}>Connect</button>
                </div>
                {/*{test ? <InstallMetamaskFlaskModel/> : null}*/}
                {/*<InstallMetamaskFlaskModel/>*/}
            </div>
        </div>
        </div>
    );
}

export default App;