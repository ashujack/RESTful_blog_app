var express = require('express');
var router = express.Router();

//Show profile
router.get('/',  (req, res)=>{
    res.send('user profile');
});

//create - show form

router.get('/createprofile', (req, res)=>{
    
})

module.exports = router;