require('dotenv').config();

const firebase = require('firebase-admin');
const firebaseAccount = require('./keys.json');

firebase.initializeApp({
 credential: firebase.credential.cert(firebaseAccount)
});

const database = firebase.firestore();

// Here we can validate If the collection vaults exists
const vaultsDB = database.collection('vaults');

const createVault = async (name: string, apiKey: string, exchange: string, owner: string) => {
  let createVaultStatus = { 
    status: 'no created',
    name: '',
    apiKey: '',
    exchange: '',
    owner: ''
  };
  try {
    const newVault = await vaultsDB.doc(apiKey).get();
    if (!newVault.exists) {
        vaultsDB.doc(apiKey).set({
          name: name,
          apiKey: apiKey,
          exchange: exchange,
          owner: owner
        }); 
        createVaultStatus.status = 'created';
        createVaultStatus.name = name;
        createVaultStatus.apiKey = apiKey;
        createVaultStatus.exchange = exchange;
        createVaultStatus.owner = owner;
    } else { createVaultStatus.status = 'The vault already exist!'; }
  }
  catch (e) { 
    createVaultStatus.status = 'There was an error creating the vault'; 
  }
  return createVaultStatus;
}

const getVault = async (apiKey: string) => {
  let status = { 
    status: 'no vault',
  };
  try {
    const vault = await vaultsDB.doc(apiKey).get();
    if (vault.exists) {
      status.status = 'vault found';
      return vault;
    } else {
      status.status = 'The vault does not exist';
    }
  } catch (e) {
    status.status = 'There was an error with the request: ' + e;
  }
}

const removeVault = async (apiKey: string) => {
  let status = { 
    status: 'no removed',
  };
  try {
    const vault = await vaultsDB.doc(apiKey).get();
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
