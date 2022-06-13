require('dotenv').config();
const ccxt = require ('ccxt');

interface usdBalances {
  [key: string]: any
}

async function setUsdBalances(vaultBase:any) {
  var obj: usdBalances = {};

  let depuredVault = {
    name: vaultBase.name,
    exchange: vaultBase.exchange,
    owner: vaultBase.owner,
    balance: vaultBase.balance,
    usdBalance: obj,
    usdTotalBalance: 0
  };

  const exchangeClass:any = ccxt[vaultBase.exchange];
  const exchange  = new exchangeClass();

  for (const key in vaultBase.balance) {
    if (vaultBase.balance[key].total > 0.01 && key !== 'USDT' && key !== 'BTTC') {
      const tokenPrice = await exchange.fetchTicker(`${key}/USDT`);
      depuredVault.usdBalance[key] = vaultBase.balance[key].total * tokenPrice.bid;
      depuredVault.usdTotalBalance = depuredVault.usdTotalBalance + depuredVault.usdBalance[key];
    } 
  }

  return depuredVault;
}

export { setUsdBalances }
