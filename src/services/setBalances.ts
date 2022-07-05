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
    usdTotalBalance: {
      free: 0,
      used: 0,
      total: 0
    }
  };

  const exchangeClass:any = ccxt[vaultBase.exchange];
  const exchange  = new exchangeClass();

  for (const key in vaultBase.balance) {
    if (vaultBase.balance[key].total > 0) {
      if (key !== 'BTTC') {
        const tokenPrice = key !== 'USDT' 
          ? await exchange.fetchTicker(`${key}/USDT`) 
          : await exchange.fetchTicker(`USDC/USDT`);
        depuredVault.usdBalance[key] = {
          total: vaultBase.balance[key].total * tokenPrice.bid,
          free: vaultBase.balance[key].free * tokenPrice.bid,
          used: vaultBase.balance[key].used * tokenPrice.bid,
        }
        depuredVault.usdTotalBalance.free = depuredVault.usdTotalBalance.free + depuredVault.usdBalance[key].free;
        depuredVault.usdTotalBalance.used = depuredVault.usdTotalBalance.used + depuredVault.usdBalance[key].used;
        depuredVault.usdTotalBalance.total = depuredVault.usdTotalBalance.total + depuredVault.usdBalance[key].total;
      }
    } else {
      delete vaultBase.balance[key]; 
    }
  }

  return depuredVault;
}

export { setBalances }
