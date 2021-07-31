const express = require('express');
const router = express.Router();
const {ensureAuth, ensureGuest }= require('../middleware/auth');
const Job= require('../models/Job')
//login
//@route get /
router.get('/', ensureGuest, (req, res)=>{
    res.render('login', {
        layout : 'login'
    })
});

//admin 
//@route get /admin
router.get('/admin', ensureAuth, async (req,res)=>{
    try{
        const jobs= await Job.find({user: req.user.id}).lean();
        res.render('admin',{
            name: req.user.firstName,
            jobs,
        })
    }catch(err){
        console.error(err)
        res.render('error/500')
    }
});

module.exports=router