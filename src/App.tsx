import React, {useState} from 'react';
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
import SendSolModal from "./components/sendSolModal";
import Icon from "react-crypto-icons";

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
    const [showModal, setShowModal] = React.useState(true);

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
                    <div className="grid grid-rows-3 grid-flow-col">
                        <div className="row-span-1 col-span-1">
                            <h2 className="text-2xl mb-3">Current Balance</h2></div>
                        <div className="col-span-1">
                            {
                                (value.balance === 0 ?
                                        <h2 className="col-span-1 text-3xl font-bold mb-5">Wallet not connected</h2>
                                        :
                                        <h2 className="col-span-1 text-6xl font-bold mb-5">${value.balance} SOL</h2>
                                )
                            }
                        </div>
                        <div className="row-span-2 col-span-2">
                            {
                                (value.balance === 0 ? null :
                                        <QRCode
                                            title="Receive"
                                            value={value.pubKey}
                                            bgColor={back}
                                            fgColor={fore}
                                            size={size === null ? 0 : size}
                                        />
                                )
                            }
                        </div>
                    </div>
                    <h1>Hello, Snaps!</h1>
                    <details className="mb-10">
                        <summary>Instructions</summary>
                        <ul>
                            <li>First, click "Connect". Then, try out the other buttons!</li>
                            <li>Please note that:</li>
                            <ul>
                                <li>
                                    The <code>snap.manifest.json</code> and <code>package.json</code> must be located in
                                    the
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
                        <FiSend className="border-2 rounded-md p-2 border-sky-500 w-20 h-20"
                                onClick={() => setShowModal(true)}/>
                        <FiSend className="border-2 rounded-md p-2 border-sky-500 w-20 h-20 rotate-180"/>
                    </div>
                    <br/>
                    {(value.pubKey != "")}
                    <br/>

                    <div className="flex flex-row justify-start items-center gap-10 text-lg">
                        <button id="connect" className="btn btn-primary" onClick={() => handleConnect()}>Connect
                        </button>
                    </div>
                    <>
                        {showModal ? (
                            <>
                                <div
                                    className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none text-black"
                                >
                                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                                        {/*content*/}
                                        <div
                                            className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                            {/*header*/}
                                            <div
                                                className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                                                <svg
                                                    className={"mr-4"}
                                                    width={32}
                                                    height={32}
                                                    viewBox="0 0 32 32"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0zm8.706 19.517H10.34a.59.59 0 00-.415.17l-2.838 2.815a.291.291 0 00.207.498H21.66a.59.59 0 00.415-.17l2.838-2.816a.291.291 0 00-.207-.497zm-3.046-5.292H7.294l-.068.007a.291.291 0 00-.14.49l2.84 2.816.07.06c.1.07.22.11.344.11h14.366l.068-.007a.291.291 0 00.14-.49l-2.84-2.816-.07-.06a.59.59 0 00-.344-.11zM24.706 9H10.34a.59.59 0 00-.415.17l-2.838 2.816a.291.291 0 00.207.497H21.66a.59.59 0 00.415-.17l2.838-2.815A.291.291 0 0024.706 9z" />
                                                </svg>
                                                <h3 className="text-3xl font-semibold">
                                                    Send SOL
                                                </h3>
                                                <button
                                                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                                    onClick={() => setShowModal(false)}
                                                >
                    <span
                        className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                                                </button>
                                            </div>
                                            <div className="relative p-6 flex-auto">
                                                <div className="mb-3 xl:w-96">
                                                    <input
                                                        type="text"
                                                        className="form-control block w-full px-3 py-1.5 text-base
          font-normal
          text-black
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
        "
                                                        id="exampleFormControlInput3"
                                                        placeholder="Recipient's SOL address"
                                                    />
                                                    <input
                                                        type="number"
                                                        className="form-control block w-full px-3 py-1.5 mt-2 text-base
          font-normal
          text-black
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          m-0
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
        "
                                                        id="exampleFormControlInput3"
                                                        placeholder="Amount"
                                                    />
                                                </div>
                                            </div>
                                            <div
                                                className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                                <button
                                                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                    type="button"
                                                    onClick={() => setShowModal(false)}
                                                >
                                                    Close
                                                </button>
                                                <button
                                                    className="bg-[#1b0044] btn btn-primary text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                    type="button"
                                                    onClick={() => sendSol()}
                                                >
                                                    Send
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                            </>
                        ) : null}
                    </>
                    {/*{test ? <InstallMetamaskFlaskModel/> : null}*/}
                    {/*<InstallMetamaskFlaskModel/>*/}
                </div>
            </div>
        </div>
    );
}

export default App;