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
    blogRoutes          = require('./routes/blog'),
    profileRoutes       = require('./routes/profile'),
    commentRoutes       = require('./routes/comments'),
    replyRoutes         = require('./routes/replies');

//APP CONFIG
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI || MONGO_URI, {useNewUrlParser:true, useUnifiedTopology:true});
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());

////////////////////////////////////////////////////////
//PASSPORT (auth) config.
var passport            = require('passport'),
    localStrategy       = require('passport-local'),
    expressSession      = require('express-session');

app.use(expressSession({
    secret: process.env.JWT_SECRET,
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
app.use('/blogs/:id/comments', (req, res, next)=>{
    req.baseParams = {id:req.params.id};
    next();
},commentRoutes);
app.use('/blogs/:id/comments/:comment_id/replies', (req,res, next)=>{
    req.baseParams = {id: req.params.id, comment_id: req.params.comment_id};
    next();
}, replyRoutes);
app.use('/user/:id', (req, res, next)=>{
    req.baseParams = {id: req.params.id};
    next();
}, profileRoutes);

app.listen(process.env.PORT, ()=>{
    console.log('server is up');
});
