const defer = require('config/defer').deferConfig;
const path = require('path');

module.exports = {
  secret: 'mysecret',
  mongoose: {
    uri: 'mongodb://fursovanton27:Der654ab@cluster0-shard-00-00-msllr.mongodb.net:27017,cluster0-shard-00-01-msllr.mongodb.net:27017,cluster0-shard-00-02-msllr.mongodb.net:27017/my_db?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin',
  },
  crypto: {
    hash: {
      length: 128,
      iterations: process.env.NODE_ENV == 'production' ? 12000 : 1,
    },
  },

  root: process.cwd(),
};
