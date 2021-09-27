/**
 * This snippet shows how to create a nodejs application connected with a near wallet to call view and change functions.
 */

const rpcNode = "https://rpc.mainnet.near.org";
const gasAttachment = new BN('50000000000000');

export async function getAccount(account_id, private_key) {
    try {

        private_key = private_key.replace('"', '');

        const keyPair = nearInstance.utils.KeyPair.fromString(private_key);
        const keyStore = new nearInstance.keyStores.InMemoryKeyStore();
        await keyStore.setKey("default", account_id, keyPair);

        const near = await nearInstance.connect({
            networkId: "default",
            deps: { keyStore },
            masterAccount: account_id,
            nodeUrl: rpcNode
        });

        return await near.account(account_id);
    } catch (e) {
        console.log(e);
    }
}

export async function callChangeFunction(contract, method, params) {
    try {
        const acc = process.env.account;
        const key = process.env.key;
        const account = await getAccount(acc, key);

        return await account.functionCall(
            contract,
            method,
            params,
            gasAttachment,
            0);
    } catch (e) {
        console.log(e);
    }
}


export async function callViewFunction(recipient, method, params) {
    try {
        const nearRpc = new nearInstance.providers.JsonRpcProvider(rpcNode);

        const account = new nearInstance.Account({ provider: nearRpc });
        return await account.viewFunction(
            recipient,
            method,
            params
        );
    } catch (e) {
        console.log(e);
    }
}
