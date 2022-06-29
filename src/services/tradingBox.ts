require('dotenv').config();
const ccxt = require ('ccxt');


const tradingBox = {
  openOrder: async (vaultsDB:any, transactionsDB:any, symbol: string, type: string, side: string, amount: string, price:string, account: string, exchange: string) => {
    let transactionStatus = { 
      status: 'order no created',
    };

    try {
      // We get the account information
      let vaults:Array<any> = [];
      const snapshot = await vaultsDB.get();
      const allVaults = snapshot.docs.map((doc: { data: () => any; }) => doc.data());
      allVaults.forEach(function (item:any, index:any) {
        if(item.owner === account && item.exchange === exchange) vaults.push(item);
      });
      const vault = vaults ? vaults[0] : {}

      // We open the order
      const exchangeClass:any = ccxt[vault.exchange];
      let exchangeTest:any;
      if (vault.api && vault.apiSecret) exchangeTest = new exchangeClass ({ 'apiKey': vault.api, 'secret': vault.apiSecret });

      // return exchangeTest.createOrder('LTC/USDT', 'market', 'buy',  1, 52.37);
      return await exchangeTest.createOrder(symbol, type, side, amount, price);
      // console.log(transaction);
      // return transaction;
      transactionStatus.status = 'Order Open';
      // We save the transaction
      const transactionsAccount = await transactionsDB.doc(account).get();

      // if (!transactionsAccount._fieldsProto) {
      //   await transactionsDB.doc(account).set({
      //     account: account,
      //     transactions: {
      //       : true
      //     }
      //   });
      //   favStatus.status = 'Added ticker to favourites';
      // } else {
      //   let favAccounts:Array<any> = [];
      //   const snapshot = await favsDB.get();
      //   const allAccounts = snapshot.docs.map((doc: { data: () => any; }) => doc.data());
      //   allAccounts.forEach(function (item:any, index:any) {
      //     if(item.account === account) favAccounts.push(item);
      //   });
  
      //   const favTickers = favAccounts ? favAccounts[0].favouriteTickers : {}
      //   favTickers[ticker] = true;
  
      //   await favsDB.doc(account).update({
      //     favouriteTickers: favTickers
      //   });
      //   favStatus.status = 'Added ticker to favourites';
      // }

    } catch (e) {
      transactionStatus.status = 'catch';
    }

    return transactionStatus;
  },
  closeOrder: async () => {
    
  }
}

export { tradingBox };
