require('dotenv').config();
const ccxt = require ('ccxt');

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
  };
  try {
    const newVault = await vaultsDB.doc(api).get();
    if (!newVault.exists) {

      const exchangeClass:any = ccxt[exchange];
      const exchangeTest = new exchangeClass ({ 'apiKey': api, 'secret': apiSecret });
      createVaultStatus.status = await exchangeTest.fetchBalance();

      vaultsDB.doc(api).set({
        name: name,
        api: api,
        apiSecret: apiSecret,
        exchange: exchange,
        owner: owner
      });
      createVaultStatus.status = 'Vault created';

    } else { createVaultStatus.status = 'The vault already exist!'; }
  }
  catch (e) { 
    createVaultStatus.status = 'There was an error creating the vault. Please make sure you have a valid api and secret keys'; 
  }
  return createVaultStatus;
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

const depureVaults = async (collection:any) => {
  let depuredVaults:Array<any> = [];

  collection.forEach(function (item:any, index:any) {
    const depuredVault = {
      name: item.name,
      exchange: item.exchange,
      owner: item.owner,
      balance: {}
    };

    depuredVaults.push(depuredVault);
  });

  return depuredVaults;
}

const getVaultsCollection = async (address:string) => {
  let vaults:Array<any> = [];
  const snapshot = await vaultsDB.get();
  const allDocuments = snapshot.docs.map((doc: { data: () => any; }) => doc.data());
  allDocuments.forEach(function (item:any, index:any) {
    if(item.owner === address) vaults.push(item);
  });
  return vaults;
}

const getVaults = async (address: string) => {
  let depuredVaults:Array<any> = [];
  const vaultsCollection = await getVaultsCollection(address);
  depuredVaults = await depureVaults(vaultsCollection);
  return depuredVaults;
}


export { createVault, removeVault, getVaults };
