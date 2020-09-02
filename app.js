var express             = require('express'),
    methodOverride      = require('method-override'),
    expressSanitizer    = require('express-sanitizer'),
    app                 = express(),
    User                = require('./models/user'),
    flash               = require('connect-flash'),
    bodyParser          = require('body-parser'),
    mongoose            = require('mongoose');

// requiring routes
var indexRoutes         = require('./routes/index'),
    blogRoutes          = require('./routes/blog');

//APP CONFIG
mongoose.connect('mongodb://localhost:27017/restfulBlog', {useNewUrlParser:true, useUnifiedTopology:true});
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());

////////////////////////////////////////////////////////
//PASSPORT (auth) config.
var passport            = require('passport'),
    localStrategy       = require('passport-local'),
    session             = require('express-session');

app.use(session({
    secret: 'dsjfhjfhsfdsf',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

app.use((req, res, next)=>{
    res.locals.loggedInUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', indexRoutes);
app.use('/blogs', blogRoutes);


app.listen(3000, ()=>{
    console.log('server is up');
});
