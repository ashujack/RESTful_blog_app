var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
var Blog = require('../models/blog');
var Comment = require('../models/comment');
const blog = require('../models/blog');


//NEW ROUTE
router.get('/new', middleware.isLoggedIn, (req,res)=>{
    Blog.findById(req.baseParams.id , (err, foundBlog)=>{
        if(err){
            req.flash('error', 'something went wrong!');
            res.redirect('back');
        }else{
            res.render('comments/new', {blog:foundBlog});
        }
    });
});

//create comment
router.post('/', middleware.isLoggedIn ,(req, res)=>{
    Blog.findById(req.baseParams.id, (err, foundBlog)=>{
        if(err){
            req.flash('error', 'something went wrong!!!!');
            res.redirect('back');
        }else{
            Comment.create(req.body.comment, (err, comment)=>{
                if(err){
                    return res.send('something went wrong!')
                }
                comment.author = {
                    id: req.user._id,
                    username: req.user.username
                };
                comment.save();
                foundBlog.comments.push(comment);
                foundBlog.save();       

                req.flash('success', 'commented successfully')
                res.redirect('back')
            });
        }
    });
});

//UPDATE comment
router.get('/:comment_id/edit',middleware.commentOwner, (req, res)=>{
    Comment.findById(req.params.comment_id, (err, foundComment)=>{
        if(err){
            res.redirect('back');
        }else{
            res.render('comments/edit', {blog_id:req.baseParams.id ,comment:foundComment});
        }  
    });
});

router.put('/:comment_id',middleware.commentOwner, (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment, (err, updatedComment)=>{
        if(err){
            res.redirect('back');
        }else{
            req.flash('success', 'comment updated successfully');
            res.redirect('/blogs/'+req.baseParams.id);
        }
    });
});

//DELETE route
router.delete('/:comment_id',middleware.commentOwner,(req, res)=>{
    Comment.findByIdAndDelete(req.params.comment_id, (err)=>{
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            req.flash('success', 'deleted successfully');
            res.redirect('/blogs/'+req.baseParams.id);
        }
    });
});

module.exports = router;
