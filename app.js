const express = require('express');
const mongoose = require('mongoose');
const mustache = require('mustache-express');
const router = require('./routes/index');
const helpers = require('./helpers');
const errorHandler = require('./handlers/errorHandler');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//configurações
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended:true } ));

app.use(express.static(__dirname+'/public'));


app.use(cookieParser(process.env.SECRET));
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.h = helpers;
    res.locals.flashes = req.flash();
    res.locals.user = req.user;
    next();
});

const User = require('./models/user'); //Vai usar o model User para o processo de autenticação/registro
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






app.use('/', router);

app.use(errorHandler.notFound);


app.engine('mst', mustache(__dirname+'/views/', '.mst'));
app.set('view engine', 'mst');
app.set('views', __dirname + '/views');

module.exports = app;
