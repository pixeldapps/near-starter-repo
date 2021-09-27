/**
 * Simple snippet example showing how a client can send a signed message
 * and a backend which verifies if that signed message is from the given account_id.
 * Additionnaly the backend can check at the near-rpc is that public key is really connected
 * to the given account_id.
 * 
 * With this way it's possible to verify the wallet-login via a traditional backend.
 */

/**
 * Client
 */
 export async function getSignedObject() {

    const keys = new keyStores.BrowserLocalStorageKeyStore();
    const signedMsg = (await keys.getKey(config.networkId, account_id)).sign(new TextEncoder().encode(account_id));
    const signature = Buffer.from(signedMsg.signature).toString('hex')

    const pubKey = Buffer.from(signedMsg.publicKey.data).toString('hex')
    const b58pubKey = b58.encode(Buffer.from(pubKey.toUpperCase(), 'hex'))
    return { signature: signature, pubkey: pubKey, b58pubkey: b58pubKey, account_id: account_id }
}

/**
 * Server
 */
const fromHexString = hexString =>
    new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

const verify = nacl.sign.detached.verify(new TextEncoder().encode(account_id), fromHexString(signature), fromHexString(pubkey));

const isKeyValid = isAccessKeyValid(account_id, b58key);


export async function isAccessKeyValid(account_id, b58key) {
    const response = await axios.post('https://rpc.testnet.near.org', {
        jsonrpc: '2.0',
        id: 'dontcare',
        method: 'query',
        params: {
            request_type: 'view_access_key',
            finality: 'final',
            account_id: account_id,
            public_key: `ed25519:${b58key}`
        }
    });

    if (response.data.result && response.data.result.error) {
        return false;
    }
    return true;
}
