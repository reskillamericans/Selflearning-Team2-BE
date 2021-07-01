const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const compression = require('compression');
const sanitizeData = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');
const hpp = require('hpp');


const app = express();

//middleware
app.use(helmet());
app.use(cors());

app.options('*', cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP'
});

app.use('/api', limiter);
app.use(sanitizeData());
app.use(xss());

//prevent parameter pollution
app.use(hpp());

app.use(express.json({ limit: '100mb' }));

app.use(compression());

//HOMEPAGE route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Self Learning',
    app: 'Name Of The App'
  });
});

// Authentication Route
app.use('/api/v1/auth', require('./routes/authRoute'));


//Handling unhandle routes
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    errorMessage: `Can't find ${req.originalUrl} on this server`
  });
});


module.exports = app;
