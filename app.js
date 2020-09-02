var express             = require('express'),
    methodOverride      = require('method-override'),
    expressSanitizer    = require('express-sanitizer'),
    app                 = express(),
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


app.use('/', indexRoutes);
app.use('/blogs', blogRoutes);


app.listen(3000, ()=>{
    console.log('server is up');
});
