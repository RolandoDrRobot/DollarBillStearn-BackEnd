require('dotenv').config();
const ccxt = require ('ccxt');

interface balances {
  [key: string]: any
}

async function setBalances(vaultBase:any) {
  var obj: balances = {};

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
    if (vaultBase.balance[key].total > 0) {
      if (key !== 'USDT' && key !== 'BTTC') {
        const tokenPrice = await exchange.fetchTicker(`${key}/USDT`);
        depuredVault.usdBalance[key] = vaultBase.balance[key].total * tokenPrice.bid;
        depuredVault.usdTotalBalance = depuredVault.usdTotalBalance + depuredVault.usdBalance[key];
      }
    } else {
      delete vaultBase.balance[key]; 
    }
  }

  return depuredVault;
}

export { setBalances }
