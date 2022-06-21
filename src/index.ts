const express = require('express');
const cors = require('cors');
import { Request, Response } from 'express';
import { createVault, getVaults, removeVault } from './services/vaultsDB';
import { fetchPrices } from './services/fetchPrices';

// Initialize server
const dollarBillServer = express();
dollarBillServer.use(cors());
dollarBillServer.use(express.json());
dollarBillServer.use(express.urlencoded({ extended: false }));
dollarBillServer.listen(443, () => {
  console.log(`Server on port 443`);
});

// Server APIs
dollarBillServer.post('/createVault', (req: Request, res: Response) => {
  createVault(req.body.name, req.body.api, req.body.apiSecret, req.body.exchange,  req.body.owner)
    .then((result) => { res.json(result); });
});

dollarBillServer.post('/removeVault', (req: Request, res: Response) => {
  removeVault(req.body.api)
    .then((result) => { res.json(result); });
});

dollarBillServer.post('/getVaults', (req: Request, res: Response) => {
  getVaults(req.body.account).then(function(result:any){
    res.json(result);
  });
});

dollarBillServer.get('/fetchPrices', (req: Request, res: Response) => {
  fetchPrices().then(function(result:any){
    res.json(result);
  });
});
