var express = require('express');
var router = express.Router();

var Blog = require('../models/blog');

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
router.get('/new', (req,res)=>{
    res.render('blogs/new');
})

//CREATE ROUTE
router.post('/', (req, res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, (err,newBlog)=>{
        if(err){
            res.render('blogs/new');
        }else{
            res.redirect('/blogs');
        }
    });
});
//SHOW ROUTE
router.get('/:id', (req, res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if(err){
            res.redirect('/blogs');
        }else{
            res.render('blogs/show', {blog: foundBlog})
        }
    });
});
//EDIT ROUTE
router.get('/:id/edit', (req, res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if(err){
            res.redirect('/blogs');
        }else{
            res.render('blogs/edit', {blog: foundBlog});
        }
    });
})
// UPDATE ROUTE
router.put('/:id', (req, res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect('/blogs/'+req.params.id);
        }
    });
});
//DELETE ROUTE
router.delete('/:id', (req, res)=>{
    Blog.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            res.redirect('/blogs');
        }else{
            res.redirect('/blogs');
        }
    });
});

module.exports = router;
