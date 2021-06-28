const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require('../models/user')
const bcrypt = require('bcrypt');

const isLogin = (req,res,next) =>{
    if(req.session.user_id){
        next()
    }
    else{
        res.redirect('/login')
    }
}

router.get('/register',(req,res)=>{

    res.render('users/register')
})
router.post('/register', async (req,res)=>{
    const { username, password, email} = req.body
    const hashedPass = await bcrypt.hash(password, 10)
    const newUser = new User({
        username  :username,
        password : hashedPass,
        email : email
    })
    await newUser.save()
    req.flash('success',"user added success")
    res.redirect('/login')
})
router.get('/login',(req,res)=>{
    res.render('users/login')
})
router.post('/login',async (req,res)=>{
    const { username, password} = req.body
    const user = await User.findOne({username: username})
    if(!user){
        req.flash("error","invalid username or pass")
        return res.redirect('/login')
    }
    const validUser = await bcrypt.compare(password, user.password)
    if(!validUser){
        req.flash("error","invalid username or pass")
        return res.redirect('/login')
    }
    req.session.user_id = user._id
    req.flash("success","user login success")
    res.redirect('/campgrounds')
})
router.get('/protected',isLogin, (req,res)=>{
    res.send("protectedRoute")
})
router.get('/logout',(req,res)=>{
    // req.session.user_id = null
    req.flash("success","user logout success")
    req.session.destroy()
    res.redirect('/login')
})


module.exports = router;