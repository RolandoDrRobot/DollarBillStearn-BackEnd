require('dotenv').config();

const firebase = require('firebase-admin');
const firebaseAccount = require('./keys.json');

firebase.initializeApp({
 credential: firebase.credential.cert(firebaseAccount)
});

const database = firebase.firestore();

// Here we can validate If the collection users exists
const usersDatabase = database.collection('users');

const createUser = async (email: string, password: string, name: string) => {
  let createUserStatus = { 
    status: 'no created',
    name: '',
    email: ''
  };
  try {
    const newUser = await usersDatabase.doc(email).get();
    if (!newUser.exists) {
        usersDatabase.doc(email).set({
          userEmail: email,
          userPassword: password,
          userName: name,
        }); 
        createUserStatus.status = 'created';
        createUserStatus.email = email;
        createUserStatus.name = name;
    } else { createUserStatus.status = 'The user already exist!'; }
  }
  catch (e) { 
    createUserStatus.status = 'There was an error creating the user'; 
  }
  return createUserStatus;
}

const login = async (email: string, password: string) => {
  let loginInfo = { 
    status: 'no logged',
    name: '',
    email: ''
  };
  try {
    const user = await usersDatabase.doc(email).get();
    if (user.exists && password === user._fieldsProto.userPassword.stringValue) {
      loginInfo.status = 'granted';
      loginInfo.email = user._fieldsProto.userEmail.stringValue;
      loginInfo.name = user._fieldsProto.userName.stringValue;
    } else {
      loginInfo.status = 'The password or user does not match';
    }
  } catch (e) {
    loginInfo.status = 'There was an error with the request: ' + e;
  }
  return loginInfo;
}

const news = async () => {
  try {
    const snapshot = await firebase.firestore().collection('news').get();
    return snapshot.docs;
  }
  catch (e) {
    console.log(e);
  }
}

export { createUser, login, news };
