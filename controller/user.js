const User = require("../models/user");

module.exports.registerUser = async(req, res) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({
            username: username,
            email: email,
        });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            //direct login
            if (err) throw err;
        });
        req.flash("success", "user added success");
        res.redirect("/campgrounds");
    } catch (e) {
        req.flash("danger", e.message);
        res.redirect("/register");
    }
}

module.exports.renderRegister = (req, res) => {
    res.render("users/register");
}

module.exports.renderLogin = (req, res) => {
    res.render("users/login");
}

module.exports.loginUser = (req, res) => {
    const redirectUrl = req.session.returnTo || "/campgrounds";
    req.flash("success", "user login success");
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    // req.session.user_id = null
    req.logout();
    req.flash("success", "user logout success");
    res.redirect("/login");
}