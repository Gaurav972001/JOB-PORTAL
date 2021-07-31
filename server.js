const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const passport = require('passport');
const methodOverride=require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose=require('mongoose');
const connectDB = require('./config/db');

const app = express();

//body-parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override
app.use(
    methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method;
        delete req.body._method;
        return method;
      }
    })
  );

//Load config
dotenv.config({ path: './config/config.env' });

//sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({ mongoUrl: process.env.URI })
}))

//passport config
require('./config/passport')(passport);

//connect database
connectDB();

//logger
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
};

//handlebars helper
const { formatDate, stripTags, truncate, select } = require('./helpers/hbs');

//handlebars
app.engine('.hbs', exphbs(
    { helpers: 
        { formatDate, stripTags, truncate, select }, 
                        defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//static 
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/jobs', require('./routes/jobs'));

const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`Server is running on http://localhost:${PORT}`));
