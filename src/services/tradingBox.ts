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

      const order =  await exchangeTest.createOrder(symbol, type, side, amount, price);
      transactionStatus.status = 'Order created sucessfully';
    } catch (e) {
      transactionStatus.status = 'catch';
    }

    return transactionStatus;
  },
  closeOrder: async () => {
    
  }
}

export { tradingBox };
