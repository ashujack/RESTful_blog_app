var express = require('express')
var router  = express.Router();
var Blog = require('../models/blog');
var Comment = require('../models/comment');
var middleware = require('../middleware');

//new reply
router.get('/new',middleware.isLoggedIn, (req, res)=>{
    Blog.findById(req.baseParams.id, (err, foundBlog)=>{
        if(err){
            req.flash('error', 'something went wrong!')
            res.redirect('back');
        }else{
            Comment.findById(req.baseParams.comment_id, (err, foundComment)=>{
                if(err){
                    req.flash('error', 'something went wrong!2');
                    res.redirect('back');
                }else{
                    res.render('replies/new', {comment: foundComment, blog: foundBlog})
                }
            });
        }
    });
});

router.post('/', middleware.isLoggedIn, (req, res)=>{
    Comment.findById(req.baseParams.comment_id, (err, foundComment)=>{
        if(err){
            req.flash('error', 'something went wrong!');
            req.redirect('back');
        }else{
            Comment.create(req.body.reply, (err, reply)=>{
                if(err){
                    req.flash('error', 'something went wrong');
                    return res.redirect('back');
                }
                reply.author ={
                    id: req.user._id,
                    username: req.user.username
                }
                reply.save();
                foundComment.comments.push(reply);
                foundComment.save();

                req.flash('success', 'replied successfully');
                res.redirect('/blogs/'+req.baseParams.id)
            });
        }
    });
});

module.exports = router;