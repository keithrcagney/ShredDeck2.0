// node module dependencies
const path = require('path');
const express = require('express');
const app = express();
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// controller middleware and routers
const dbController = require('./controllers/dbController.js');
const authController = require('./controllers/authController.js');
const deckRouter = require('./routers/deckRouter.js');
const shredRouter = require('./routers/shredRouter.js');

// development and production variables
const devMode = process.env.NODE_ENV !== 'production';
const config = devMode ? require('../webpack.dev.js') : require('../webpack.prod.js');
const compiler = webpack(config);
const PORT = process.env.PORT || 8080;
const DIST_DIR = path.resolve(__dirname, '/dist');
const HTML_FILE = path.resolve(DIST_DIR, 'index.html');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// determines webpack compiler option from NODE_ENV variable
// also dynamically creates necessary dev databases if purged

if (devMode) {
  console.log('Launching server in development mode.');

  app.use(webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  }));

  app.use(webpackHotMiddleware(compiler));

  app.get('/', authController.cookieCheck, (req, res, next) => {
    if (req.cookies.token) {
      res.redirect('/deckDash');
    } else {
      compiler
        .outputFileSystem
        .readFile(HTML_FILE, (err, result) => {
          if (err) {
            return next(err);
          }
          res.set('content-type', 'text/html');
          res.send(result);
      });
    }
  });
} else {
  app.get('/', authController.cookieCheck, (req, res, next) => {
    if (req.cookies.token){
      res.redirect('/deckDash');
    } else {
      res.sendFile(HTML_FILE);
    }
  })
}

//serve static assets from dist folder
app.use(express.static(DIST_DIR));

//handle signup and login events from root page
app.post('/signup', authController.signupUser, (req, res, next) => {
  if (res.locals.redirect){
    res.json({
      status: "redirect",
      body: res.locals.redirect
    })
  } else {
    res.json({ status: "success" });
  }
});

app.post('/login', authController.loginUser, (req, res, next) => {
  if (res.locals.denied) {
    res.json({
      status: "denied"
    })
  } else {
    res.json({ status: "success"});
  }
})

//handle basic access to the deckDash page upon authentication
app.get('/deckDash', authController.cookieCheck, (req, res, next) => {
  if (req.cookies.token) {
    res.json({ status: "success" })
  } else {
    res.json({ Forbidden: "You must be logged in to view this page." });
  }
})

//handle CRUD operations on tables in dB with routers
app.use('/deck', deckRouter);
app.use('/shred', shredRouter);

//implement global error handler
app.use((err, req, res, next) => {
  const defaultErrorObj = {
    log: `An unknown error occured performing ${req.method} / ${res.method}`,
    msg: 'An unknown error occurred. See log for details.',
  };
  if (err) {
    const error = Object.assign(defaultErrorObj, err);
    res.status(403).send(error);
  }
});

//instantiate server on derived port
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

if (module.hot){
  module.hot.accept(
    './server.js',
    (err) => console.error(err)
  );
}