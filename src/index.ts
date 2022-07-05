const express = require('express');
const cors = require('cors');
import { Request, Response } from 'express';
import { run } from './services/firebase';
import { createVault, getVaults, removeVault } from './services/vaultsDB';
import { fetchPrices } from './services/fetchPrices';
import { tradingBox } from './services/tradingBox';
import { fetchOrders } from './services/orders';
import { fav, removeFav, getFavs } from './services/favourites';

// Initialize server
const dollarBillServer = express();
dollarBillServer.use(cors());
dollarBillServer.use(express.json());
dollarBillServer.use(express.urlencoded({ extended: false }));
dollarBillServer.listen(443, () => {
  console.log(`Server on port 443`);
});

const database = run();

// Server APIs
// VAULTS
const vaultsDB = database.collection('vaults');

dollarBillServer.post('/createVault', (req: Request, res: Response) => {
  createVault(vaultsDB, req.body.name, req.body.api, req.body.apiSecret, req.body.exchange,  req.body.owner)
    .then((result) => { res.json(result); });
});

dollarBillServer.post('/removeVault', (req: Request, res: Response) => {
  removeVault(vaultsDB, req.body.api)
    .then((result) => { res.json(result); });
});

dollarBillServer.post('/getVaults', (req: Request, res: Response) => {
  getVaults(vaultsDB, req.body.account).then(function(result:any){
    res.json(result);
  });
});


// EXCHANGE
const transactionsDB = database.collection('transactions');

dollarBillServer.get('/fetchPrices', (req: Request, res: Response) => {
  fetchPrices().then(function(result:any){
    res.json(result);
  });
});

dollarBillServer.post('/openOrder', (req: Request, res: Response) => {
  tradingBox.openOrder(vaultsDB, transactionsDB, req.body.symbol, req.body.type, req.body.side, req.body.amount, req.body.price, req.body.account, req.body.exchange).then(function(result:any){
    res.json(result);
  });
});

dollarBillServer.post('/closeOrder', (req: Request, res: Response) => {
  tradingBox.closeOrder().then(function(result:any){
    res.json(result);
  });
});

dollarBillServer.post('/fetchOrders', (req: Request, res: Response) => {
  fetchOrders(vaultsDB, req.body.account, req.body.exchange).then(function(result:any){
    res.json(result);
  });
});

// FAVOURITES
const favsDB = database.collection('favourites');

dollarBillServer.post('/fav', (req: Request, res: Response) => {
  fav(favsDB, req.body.account, req.body.ticker).then(function(result:any){
    res.json(result);
  });
});

dollarBillServer.post('/removeFav', (req: Request, res: Response) => {
  removeFav(favsDB, req.body.account, req.body.ticker).then(function(result:any){
    res.json(result);
  });
});

dollarBillServer.post('/getFavs', (req: Request, res: Response) => {
  getFavs(favsDB, req.body.account).then(function(result:any){
    res.json(result);
  });
});
