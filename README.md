# 💸⚡️ DollarBill-BackEnd
# 📘 Table of contents
1. [What is this](#-what-is-this)
2. [Features](#%EF%B8%8F-features)
3. [How to install](#%EF%B8%8F-how-to-install)
4. [How to use](#%EF%B8%8F-how-to-use)
4. [Improvements Ideas](#-improvements-ideas)

## 💸 What is this
- This is the backend for Internal APP of [Dollar Bill](https://github.com/RolandoDrRobot/DollarBillStearn-FrontEnd)
- Dollar Bill is a dashboard for individual investors, track assets, watch the market and trading
- It uses Firebase for storing the users and news
- It is written in typescript, uses node and a simple express server implementation
- It works as an API service and cover the following services for the app 👇

## ⚡️ Features
- CRUD for vaults (your exchange wallet) 
- Watch the markets (API prices) and save favourites
- Trading box, open and close orders in your preferred exchange

## ⚙️ How to install
- Clone this repo: `git clone https://github.dev/RolandoDrRobot/CoraToken-BackEnd`
- Go to `my-app` and `npm install`
- Run `npm run dev`
- Right now only works on localhost, still planning the meaning of this project
- When you start the server, It will be availble on port 443, so, the APIs links will be preceeded by `localhost:443`

## ⚙️ How to use
- VAULTS
- createVault: endpoint `/createVault` pass as arguments `(vaultsDB, name, api, apiSecret, exchange, owner)`
- removeVault: endpoint `/removeVault` pass as arguments `(vaultsDB, api)`
- getVaults: endpoint `/getVaults` pass as arguments `(vaultsDB, account)`

- EXCHANGE
- fetchPrices user: endpoint `/fetchPrices` this is a get call
- openOrder: endpoint `/openOrder` pass as arguments `(vaultsDB, transactionsDB, symbol, type, side, amount, price, account, exchange)`
- closeOrder: endpoint `/closeOrder` not working yet
- fetchOrders: endpoint `/fetchOrders` pass as arguments `(vaultsDB, account, exchange)`
- cancelOrder: endpoint `/cancelOrder` pass as arguments `(vaultsDB, account, exchange, orderID, ticker)`

- FAVOURITES
- add favourites: endpoint `/fav` pass as arguments `(favsDB, account, ticker)`
- remove favourites: endpoint `/removeFav` pass as arguments `(favsDB, account, ticker)`
- get favourites: endpoint `/getFavs` pass as arguments `(favsDB, account)`

## 📘 Improvements Ideas