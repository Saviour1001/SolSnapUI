import {FC} from 'react';
import "./home.css"
import {FiSend} from "react-icons/fi";
import {enableWallet} from "../api/enable_wallet";
import InstallMetamaskFlaskModel from "./installMetamaskFlaskModel";
import {
    SystemProgram,
    PublicKey,
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    clusterApiUrl,
    Transaction
} from "@solana/web3.js";
import {useState} from 'react';
import QRCode from 'react-qr-code';

var solana_logo = require("../images/solana-logo.png")
const Home: FC = () => {

    const test = true

    return (
        <div className="w-full h-full flex justify-center align-center py-10">

            <div className="container w-1/2 p-10 text-white">
                <div className="flex flex-row justify-start items-center gap-5 mb-10">
                    <img src={solana_logo} className="w-20 h-20"/>
                    <h1 className="text-5xl font-semibold">SolanaSnap</h1>
                </div>
                <h2 className="text-2xl mb-3">Current Balance</h2>
                <h2 className="text-6xl font-bold mb-5">0 SOL</h2>
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
                    <FiSend className="border-2 rounded-md p-2 border-sky-500 w-20 h-20"/>
                    <FiSend className="border-2 rounded-md p-2 border-sky-500 w-20 h-20 rotate-180"/>
                </div>
                <br/>

                <div className="flex flex-row justify-start items-center gap-10 text-lg">
                    <button id="connect" className="btn btn-primary">Connect</button>
                    <button id="getBalance" className="btn btn-primary" onClick={() => enableWallet(window)}>
                        Send Hello
                    </button>
                    <button id="send" className="btn btn-primary">Send Goodbye</button>
                </div>
                {/*{test ? <InstallMetamaskFlaskModel/> : null}*/}
                {/*<InstallMetamaskFlaskModel/>*/}
            </div>
        </div>
    );
};

export default Home;