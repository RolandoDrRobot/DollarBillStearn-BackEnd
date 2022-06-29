const ccxt = require ('ccxt');

const fetchPrices = async () => {
  const binanceInstance:any = ccxt['binance'];
  const binance  = new binanceInstance();
  const binanceTickers = await binance.fetchTickers();

  const ftxInstance:any = ccxt['ftx'];
  const ftx  = new ftxInstance();
  const ftxTickers = await ftx.fetchTickers();

  const okxInstance:any = ccxt['binance'];
  const okx  = new okxInstance();
  const okxTickers = await okx.fetchTickers();

  let pricesTable = [];
  interface tickerPrices {
    symbol: string,
    binance: {
      price: number,
      volume: number,
      percentage: number
    },
    ftx: {
      price: number,
      volume: number,
      percentage: number
    },
    okx: {
      price: number,
      volume: number,
      percentage: number
    }
  }

  for (const ticker in binanceTickers) {
    if (ticker.includes('/USDT')) {
      let tickerPrice:tickerPrices = {
        symbol: ticker,
        binance: {
          price: binanceTickers[ticker].bid,
          volume: binanceTickers[ticker].quoteVolume,
          percentage: binanceTickers[ticker].percentage,
        },
        ftx: {
          price: 0,
          volume: 0,
          percentage: 0
        },
        okx: {
          price: 0,
          volume: 0,
          percentage: 0
        }
      }
      pricesTable.push(tickerPrice);
    }
  }

  pricesTable.forEach(function(item, index) {
    for (const ticker in ftxTickers) {
      if (ticker.includes('/USDT') && item.symbol === ticker) {
        item.ftx = {
          price: ftxTickers[ticker].bid,
          volume: ftxTickers[ticker].quoteVolume,
          percentage: ftxTickers[ticker].percentage,
        }
      }
    }
  });

  pricesTable.forEach(function(item, index) {
    for (const ticker in okxTickers) {
      if (ticker.includes('/USDT') && item.symbol === ticker) {
        item.okx = {
          price: okxTickers[ticker].bid,
          volume: okxTickers[ticker].quoteVolume,
          percentage: okxTickers[ticker].percentage,
        }
      }
    }
  });

  return pricesTable;
}

export { fetchPrices };
