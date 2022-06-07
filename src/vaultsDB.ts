require('dotenv').config();

const firebase = require('firebase-admin');
const firebaseAccount = require('./keys.json');

firebase.initializeApp({
 credential: firebase.credential.cert(firebaseAccount)
});

const database = firebase.firestore();

// Here we can validate If the collection vaults exists
const vaultsDB = database.collection('vaults');

const createVault = async (name: string, api: string, apiSecret: string, exchange: string, owner: string) => {
  let createVaultStatus = { 
    status: 'no created',
    name: '',
    api: '',
    apiSecret: '',
    exchange: '',
    owner: ''
  };
  try {
    const newVault = await vaultsDB.doc(api).get();
    if (!newVault.exists) {
        vaultsDB.doc(api).set({
          name: name,
          api: api,
          apiSecret: apiSecret,
          exchange: exchange,
          owner: owner
        }); 
        createVaultStatus.status = 'created';
        createVaultStatus.name = name;
        createVaultStatus.api = api;
        createVaultStatus.apiSecret = apiSecret;
        createVaultStatus.exchange = exchange;
        createVaultStatus.owner = owner;
    } else { createVaultStatus.status = 'The vault already exist!'; }
  }
  catch (e) { 
    createVaultStatus.status = 'There was an error creating the vault'; 
  }
  return createVaultStatus;
}

const getVault = async (address: string) => {
  let vaults:Array<any> = [];
  try {
    const snapshot = await vaultsDB.get();
    const allDocuments = snapshot.docs.map((doc: { data: () => any; }) => doc.data());
    allDocuments.forEach(function (item:any, index:any) {
       if(item.owner === address) vaults.push(item);
    });
    return vaults;
    
  } catch (e) {
    
  }
}

const removeVault = async (api: string) => {
  let status = { 
    status: 'no removed',
  };
  try {
    const vault = await vaultsDB.doc(api).get();
    if (vault.exists) {
      status.status = 'removed';
    } else {
      status.status = 'The Vault does not exist';
    }
  } catch (e) {
    status.status = 'There was an error with the request: ' + e;
  }
  return status;
}


export { createVault, getVault, removeVault };
