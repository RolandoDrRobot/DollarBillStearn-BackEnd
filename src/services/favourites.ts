require('dotenv').config();

const firebase = require('firebase-admin');
const firebaseAccount = require('../keys.json');

firebase.initializeApp({
 credential: firebase.credential.cert(firebaseAccount)
});

const database = firebase.firestore();

const vaultsDB = database.collection('favourites');

const fav = async (account: string, ticker: string) => {
  let createFavouriteStatus = { 
    status: 'no created',
  };
  try {
    const newFavouriteAccount = await vaultsDB.doc(account).get();
    if (!newFavouriteAccount.exists) {
      vaultsDB.doc(account).set({
        account: account,
        favouriteTickers: []
      });
      createFavouriteStatus.status = 'Favourite account created';
    } else { createFavouriteStatus.status = 'The favourite account already exist!'; }
  }
  catch (e) { 
    createFavouriteStatus.status = 'There was an error creating the vault. Please make sure you have a valid api and secret keys'; 
  }
  return createFavouriteStatus;
}

const removeFav = async (api: string) => {
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

const getFavs = async (address: string) => {
  let vaults:Array<any> = [];
  let depuredVaults:Array<any> = [];
  
  const snapshot = await vaultsDB.get();
  const allDocuments = snapshot.docs.map((doc: { data: () => any; }) => doc.data());
  allDocuments.forEach(function (item:any, index:any) {
    if(item.owner === address) vaults.push(item);
  });

  return depuredVaults;
}


export { fav, removeFav, getFavs };
