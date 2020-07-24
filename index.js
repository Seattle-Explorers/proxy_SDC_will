require('dotenv').config();
const Console = require('console');
const path = require('path');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

// have a server that takes various different api calls:
// localhost:8080/description/:id
// localhost:8080/reviews/api/:id
// localhost:8080/reservations/api/:id
// and translates them into calls on different ports where the backends are
// localhost:3000/description/:id
// localhost:3001/description/:id
// localhost:3002/reservations/:id

const port = process.env.PORT || 8080;

const proxyOptions = {
  target: 'localhost',
  changeOrigin: true,
  router: {
    'localhost:8080/api/description': 'http://localhost:3000',
    'localhost:8080/api/reviews': 'http://localhost:3002',
    'localhost:8080/api/reservation': 'http://localhost:3001',
  },
};

const proxy = createProxyMiddleware(proxyOptions);
const app = express();
const proxyPath = path.join(__dirname);
const descPath = path.join(__dirname, '..', 'FEC-Description-Component', 'client', 'dist');
const revPath = path.join(__dirname, '..', 'FEC-Reviews-Component', 'client', 'public');
const resPath = path.join(__dirname, '..', 'FEC-Reservation-Component', 'client', 'dist');
app.use('/api', proxy);
app.use('/', express.static(proxyPath));
app.use('/description', express.static(descPath));
app.use('/reservation', express.static(resPath));
app.use('/review', express.static(revPath));

app.listen(port, () => {
  Console.log(`proxy listening on port ${port}`);
});
