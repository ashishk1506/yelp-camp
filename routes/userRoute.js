const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const userController = require('../controller/user')

router.route('/register')
    .get(userController.renderRegister)
    .post(userController.registerUser)

router.route('/login')
    .get(userController.renderLogin)
    .post(passport.authenticate("local", {
        failureFlash: "Invalid username or password.",
        failureRedirect: "/login",
    }), userController.loginUser)

router.get("/logout", userController.logout);

module.exports = router;