const mongoose = require('mongoose');
const crypto = require('crypto');
const config = require('config');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  salt: {
    required: true,
    type: String,
  },
  bill: {
    type: Object,
  },
  categories: [
    {
      id: mongoose.Schema.Types.ObjectId,
      name: String,
      limit: Number,
      costs: Number,
    },
  ],
  events: [{
    id: mongoose.Schema.Types.ObjectId,
    typeName: String,
    description: String,
    category: String,
    amount: Number,
    date: String,
  }],
}, { timestamps: true });


userSchema.virtual('password')
  .set(function (password) {
    this._plainPassword = password;

    if (password) {
      this.salt = crypto.randomBytes(config.crypto.hash.length).toString('base64');
      this.passwordHash = crypto.pbkdf2Sync(
        password,
        this.salt,
        config.crypto.hash.iterations,
        config.crypto.hash.length,
        'sha1',
      ).toString('base64');
    } else {
      // remove password (unable to login w/ password any more, but can use providers)
      this.salt = undefined;
      this.passwordHash = undefined;
    }
  })
  .get(function () {
    return this._plainPassword;
  });

userSchema.methods.checkPassword = function (password) {
  if (!password) return false;
  if (!this.passwordHash) return false;
  return crypto.pbkdf2Sync(
    password,
    this.salt,
    config.crypto.hash.iterations,
    config.crypto.hash.length,
    'sha1',
  ).toString('base64') == this.passwordHash;
};

module.exports = mongoose.model('user', userSchema);
