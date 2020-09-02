var express = require('express');
var router = express.Router();

//RESTFUL ROUTES
router.get('/', (req,res)=>{
    res.redirect('/blogs');
});

module.exports = router;