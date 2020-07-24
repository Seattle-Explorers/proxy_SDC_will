require('dotenv').config();
const Console = require('console');
const path = require('path');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const port = process.env.PORT || 8080;
const app = express();
const proxyPath = path.join(__dirname);

const descriptionOptions = {
  target: `http://${process.env.DESC_DNS}` || 'localhost:3000',
  changeOrigin: true,
};

const reservationOptions = {
  target: `http://${process.env.RESERVE_DNS}` || 'localhost:3001',
  changeOrigin: true,
};

const reviewsOptions = {
  target: `http://${process.env.REVIEW_DNS}` || 'localhost:3002',
  changeOrigin: true,
};

const descriptionPath = createProxyMiddleware(descriptionOptions);
const reviewsPath = createProxyMiddleware(reviewsOptions);
const reservationPath = createProxyMiddleware(reservationOptions);

app.use('/:id', express.static(proxyPath));

app.get('/description/main.js', descriptionPath);
app.get('/api/description/:id', descriptionPath);

app.get('/:id/reservation/reservationBundle.js', reservationPath);
app.get('/api/reservation/:id', reservationPath);

app.get('/:id/reviews/bundle.js', reviewsPath);
app.get('/api/reviews/:id', reviewsPath);

app.listen(port, () => {
  Console.log(`proxy listening on port ${port}`);
});
