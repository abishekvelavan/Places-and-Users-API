const express = require('express');
const bodyParser = require('body-parser');
const PlaceRoutes = require('./routes/places');
const UserRoutes = require('./routes/users');
const HttpError = require('./models/http-error');
const mongoose = require('mongoose');

const App = express();
App.use(express.json());
App.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  next();
});
App.use('/api/places', PlaceRoutes);
App.use('/api/users', UserRoutes);

App.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'Internal Server Error' });
});

App.use((error, req, res, next) => {
  throw new HttpError('This Route does not exist', 404);
});

mongoose
  .connect(`mongodb+srv://abi:${encodeURIComponent('Way11@123')}@cluster0.m3yk5jk.mongodb.net/places?retryWrites=true&w=majority`)
  .then(() => {
    App.listen(5000);
    console.log('Server connected to db');
  })
  .catch((err) => {
    console.log(err);
  });
