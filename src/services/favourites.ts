const createFavAccount = async (favsDB:any, account: string) => {
  let createFavouriteStatus = { 
    status: 'no created',
  };
  try {
    
    createFavouriteStatus.status = 'created';
  }
  catch (e) { 
    createFavouriteStatus.status = 'There was an error creating the Favourite account'; 
  }
  return createFavouriteStatus;
}

const fav = async (favsDB:any, account: string, ticker:string) => {
  let favStatus = { 
    status: 'Ticker no added',
  };
  try {
    const favAccount = await favsDB.doc(account).get();
    if (!favAccount._fieldsProto) {
      await favsDB.doc(account).set({
        account: account,
        favouriteTickers: {
          [ticker]: true
        }
      });
      favStatus.status = 'Added ticker to favourites';
    } else {
      let favAccounts:Array<any> = [];
      const snapshot = await favsDB.get();
      const allAccounts = snapshot.docs.map((doc: { data: () => any; }) => doc.data());
      allAccounts.forEach(function (item:any, index:any) {
        if(item.account === account) favAccounts.push(item);
      });

      const favTickers = favAccounts ? favAccounts[0].favouriteTickers : {}
      favTickers[ticker] = true;

      await favsDB.doc(account).update({
        favouriteTickers: favTickers
      });
      favStatus.status = 'Added ticker to favourites';
    }
  }
  catch (e) { 
    favStatus.status = 'There was an error'; 
  }
  return favStatus;
}

const removeFav = async (favsDB:any, account: string, ticker:string) => {
  let favStatus = { 
    status: 'no fav',
  };
  try {
    let favAccounts:Array<any> = [];
    const snapshot = await favsDB.get();
    const allAccounts = snapshot.docs.map((doc: { data: () => any; }) => doc.data());
    allAccounts.forEach(function (item:any, index:any) {
      if(item.account === account) favAccounts.push(item);
    });

    const favTickers = favAccounts ? favAccounts[0].favouriteTickers : {}
    favTickers[ticker] = false;

    await favsDB.doc(account).update({
      favouriteTickers: favTickers
    });
    favStatus.status = 'Removed ticker to favourites';
  }
  catch (e) { 
    favStatus.status = 'There was an error'; 
  }
  return favStatus;
}

const getFavs = async (favsDB:any, account: string) => {
  let favAccount:any = {};
  
  const snapshot = await favsDB.get();
  const allFavsAccounts = snapshot.docs.map((doc: { data: () => any; }) => doc.data());
  allFavsAccounts.forEach(function (item:any, index:any) {
    if(item.account === account) favAccount = item;
  });

  console.log(favAccount);
  return favAccount;
}


export { fav, removeFav, getFavs };
