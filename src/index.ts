const express = require('express');
const cors = require('cors');
import { Request, Response } from 'express';
import { createVault, getVaults, removeVault } from './vaultsDB';

// Initialize server
const vaultsServer = express();
vaultsServer.use(cors());
vaultsServer.use(express.json());
vaultsServer.use(express.urlencoded({ extended: false }));
vaultsServer.listen(443, () => {
  console.log(`Server on port 443`);
});

// Server APIs
vaultsServer.post('/createVault', (req: Request, res: Response) => {
  createVault(req.body.name, req.body.api, req.body.apiSecret, req.body.exchange,  req.body.owner)
    .then((result) => { res.json(result); });
});

vaultsServer.post('/removeVault', (req: Request, res: Response) => {
  removeVault(req.body.api)
    .then((result) => { console.log(result) ; res.json(result); });
});

vaultsServer.post('/getVaults', (req: Request, res: Response) => {
  getVaults(req.body.account).then(function(result:any){
    res.json(result);
  });
});
