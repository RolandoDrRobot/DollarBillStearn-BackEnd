const ccxt = require ('ccxt');

const fetchOrders = async (vaultsDB:any, account:string, exchange:string) => {
  let orderStatus = { 
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

    const balances = await exchangeTest.fetchBalance();

    let orders:any = {};

    for (const ticker in balances) {
      if (balances[ticker].total > 0 && ticker !== 'USDT' && ticker !== 'BTTC') {
        orders[ticker] = await exchangeTest.fetchOrders(`${ticker}/USDT`);
      }
    }

    orderStatus.status = orders;

  } catch (e) {
    orderStatus.status = 'catch';
  }

  return orderStatus;
}


export { fetchOrders };
