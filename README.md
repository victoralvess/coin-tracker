# Coin Tracker

Simple application that shows current crypto prices.

# Technologies

### Client

- Language: TypeScript
- Framework: Vue.js
- CSS: Tailwind CSS
- Requests: Axios, WebSocket
- Charts: ApexCharts

### Server

- Runtime: Node.js 20.x
- Language: TypeScript
- Framework: Express
- Tests: Vitest

### Icons

- Crytocurrency icons by [cryptoicons.co](http://cryptoicons.co/)
- App icons by [Font Awesome](https://fontawesome.com/)


### Data

- Data by [coincap.io](https://coincap.io/)

# Features

- Search for cryptocurrencies
- Check current prices
- Get live price updates
- Favorite cryptocurrencies locally

# How to run

## Docker

If you have Docker installed, go to the root folder and run `docker compose up`. The `server` will be available at `http://localhost:3000` and the client will be available at `http://localhost:3001`.

## Without Docker

To run without Docker, open each project in a terminal.  For both projects run `npm install`. Then, for the `server`, run `npm run build && npm start` and the app wil be available at `http://localhost:3000`. For the `client`, run `npm run dev` and the app will be available locally (the command will tell you in which port).

__NOTE__: the `client` expects the `server` to be available at `http://localhost:3000` because it's hardcoded 🙂.