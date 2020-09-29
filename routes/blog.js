var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
var Blog = require('../models/blog');
const comment = require('../models/comment');
const blog = require('../models/blog');

//INDEX ROUTE
router.get('/', (req, res)=>{
    Blog.find({}, (err, blogs)=>{
        if(err){
            console.log(err);
        }else{
            res.render('blogs/index', {blogs:blogs});
        }
    });
});

//NEW ROUTE
router.get('/new',middleware.isLoggedIn, (req,res)=>{
    res.render('blogs/new');
})

//CREATE ROUTE
router.post('/', middleware.isLoggedIn, (req, res)=>{
    
    //sanitize blog data to avoid scripts in body
    req.body.blog.body = req.sanitize(req.body.blog.body)
    
    var author = {
        id: req.user._id,
        username : req.user.username
    }
    req.body.blog.author = author;

    Blog.create(req.body.blog, (err,newBlog)=>{
        if(err){
            req.flash('error', 'something went wrong!')
            res.redirect('back');
        }else{
            req.flash('success', 'blog submitted successfully');
            res.redirect('/blogs');
        }
    });
});
//SHOW ROUTE
router.get('/:id', (req, res)=>{
    Blog.findById(req.params.id).populate('comments').exec((err, foundBlog)=>{
        if(err){
            req.flash('error','something  went wrong!');
            res.redirect('/blogs');
        }else{
            res.render('blogs/show', {blog: foundBlog})
        }
    });
});
//EDIT ROUTE
router.get('/:id/edit',middleware.blogOwner, (req, res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if(err){
            req.flash('error','something  went wrong!');
            res.redirect('/blogs');
        }else{
            res.render('blogs/edit', {blog: foundBlog});
        }
    });
})
// UPDATE ROUTE
router.put('/:id', middleware.blogOwner, (req, res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog)=>{
        if(err){
            req.flash('error','something  went wrong!');
            res.redirect("/blogs");
        }else{
            req.flash('success', 'blog updated successfully');
            res.redirect('/blogs/'+req.params.id);
        }
    });
});
//DELETE ROUTE
router.delete('/:id',middleware.blogOwner, (req, res)=>{
    Blog.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            req.flash('error','something  went wrong!');
            res.redirect('/blogs');
        }else{
            req.flash('success', 'blog deleted successfully');
            res.redirect('/blogs');
        }
    });
});

module.exports = router;
