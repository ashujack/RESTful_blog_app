var Blog = require('../models/blog');
middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'you need to be logged in to do that!');
    res.redirect('/login');
}

middlewareObj.blogOwner  = function(req, res, next){
    if(req.isAuthenticated()){
        Blog.findById(req.params.id,(err, foundBlog)=>{
            if(err){
                req.flash('error', 'something went wrong!');
                res.redirect('back');
            }else if(foundBlog.author.id.equals(req.user._id)){
                next();
            }else{
                req.flash('error', 'you don\'t have permission!');
                res.redirect('back');
            }
        });
    }else{
        req.flash('error','You need to be logged in!');
        res.redirect('/login');
    }
}

module.exports = middlewareObj;