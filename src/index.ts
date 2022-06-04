const express = require('express');
const cors = require('cors');
import { Request, Response } from 'express';
import { createUser, login, news } from './database';

// Initialize server
const moviesServer = express();
moviesServer.use(cors());
moviesServer.use(express.json());
moviesServer.use(express.urlencoded({ extended: false }));
moviesServer.listen(443, () => {
  console.log(`Server on port 443`);
});

// Server APIs
moviesServer.post('/createUser', (req: Request, res: Response) => {
  createUser(req.body.email, req.body.password, req.body.name)
    .then((result) => { res.json(result); });
});

moviesServer.post('/login', (req: Request, res: Response) => {
  login(req.body.email, req.body.password)
    .then((result) => { console.log(result) ; res.json(result); });
});

moviesServer.get('/news', (req: Request, res: Response) => {
  news().then(function(result){
    res.json(result);
  });
});
