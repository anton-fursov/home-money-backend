const User = require('../models/user');

exports.getUser = async function (ctx, next) {
  if (ctx.query) {
    const res = await User.findOne(ctx.query);
    if (res) {
      ctx.body = true;
    } else {
      ctx.body = false;
    }
  }
};

exports.postUser = async function (ctx, next) {
  const user = new User({
    email: ctx.request.body.email.toLowerCase(),
    name: ctx.request.body.name,
    password: ctx.request.body.password,
    categories: [],
    events: [],
    bill: {
      value: 1000,
    },
  });
  await user.save();
  ctx.body = '';
};
exports.getBill = async function (ctx) {
  const id = ctx.query.id;
  const res = await User.findById(id);

  ctx.body = res.bill.value;
};
exports.updateBill = async function (ctx) {
  const value = ctx.request.body.value;
  const id = ctx.query.id;
  await User.findByIdAndUpdate(id, { bill: { value } });
  ctx.statusCode = 200;
  ctx.body = '';
};
exports.getCategories = async function (ctx) {
  const id = ctx.query.id;
  const res = await User.findById(id);
  ctx.body = res.categories;
};
exports.addCategories = async function (ctx) {
  const category = ctx.request.body;
  const id = ctx.query.id;
  await User.findByIdAndUpdate(id, { $push: { categories: category } });
  ctx.statusCode = 200;
  ctx.body = 'ok';
};
exports.editCategories = async function (ctx) {
  const data = ctx.request.body;
  await User.update({ 'categories._id': data.id }, {
    $set: {
      'categories.$.name': data.name,
      'categories.$.limit': data.limit,
    },
  });
  ctx.statusCode = 200;
  ctx.body = 'ok';
};
exports.updateCosts = async function (ctx) {
  const data = ctx.request.body;
  await User.update({ 'categories._id': data.id }, {
    $set: {
      'categories.$.costs': data.costs,
    },
  });
  ctx.statusCode = 200;
  ctx.body = '';
};

exports.addEvent = async function (ctx) {
  const event = ctx.request.body;
  const id = ctx.query.id;
  await User.findByIdAndUpdate(id, { $push: { events: event } });
  ctx.statusCode = 200;
  ctx.body = '';
};
exports.getEvents = async function (ctx) {
  const id = ctx.query.id;
  const res = await User.findById(id);
  ctx.body = res.events;
};

