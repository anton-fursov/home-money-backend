const Koa = require('koa');
const app = new Koa();
const cors = require('koa-cors');
const routers = require('./routes/s');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const passport = require('koa-passport');
const passportJWT = require('passport-jwt');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

app.use(cors());

const config = require('config');
const mongoose = require('./libs/mongoose');

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = config.get('secret');
console.log(jwtOptions.secretOrKey);

const User = require('./models/user');

const strategy = new JwtStrategy(jwtOptions, ((jwt_payload, next) => {
  User.find({}, (err, res) => {
    const user = res[_.findIndex(res, { id: jwt_payload.id })];
    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
  });
}));

passport.use(strategy);
app.use(passport.initialize());

const path = require('path');
const fs = require('fs');

app.keys = [config.get('secret')];
const handlers = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();
handlers.forEach(handler => require(`./middlewares/${handler}`).init(app));

const Router = require('koa-router');
const router = new Router();

router.post('/login', async (ctx, next) => {
  let email;
  let pass;
  if (ctx.request.body.email && ctx.request.body.password) {
    email = ctx.request.body.email;
    pass = ctx.request.body.password;
  }
  let user;
  await User.findOne({ email }, (err, res) => {
    user = res;
  });
  if (!user) {
    ctx.statusCode = 401;
    ctx.body = JSON.stringify({ message: 'no such user found' });
    return;
  }
  if (user.checkPassword(pass)) {
    const payload = { id: user.id };
    const token = jwt.sign(payload, jwtOptions.secretOrKey);
    ctx.statusCode = 200;
    ctx.body = JSON.stringify({ id: user.id, name: user.name, token });
  } else {
    ctx.statusCode = 401;
    ctx.body = JSON.stringify({ message: 'passwords did not match' });
  }
});
// router.get('/secret', passport.authenticate('jwt', {session: false}), async (ctx, next) => {
//   console.log(ctx.isAuthenticated)
//   ctx.body = 'ok';
// });
router.get('/', async function(ctx){
  ctx.body = 'Hello'
} )

router.get('/users', routers.getUser);
router.post('/users', routers.postUser);
router.get('/bill', routers.getBill);
router.post('/bill', routers.updateBill);
router.get('/categories', routers.getCategories);
router.post('/categories', routers.addCategories);
router.put('/categories', routers.editCategories);
router.put('/categories_uc', routers.updateCosts);
router.post('/event', routers.addEvent);
router.get('/event', routers.getEvents);


app.use(router.routes());

app.listen(process.env.PORT || 3000);
