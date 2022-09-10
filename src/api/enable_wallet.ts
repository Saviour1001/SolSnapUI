export async function enableWallet(ethereum) {
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