const Campground = require("./models/campgrounds");
const { CampgroundSchema } = require("./schemas");
const { ReviewSchema } = require("./schemas");
const Review = require('./models/review')

module.exports.isLoggedin = (req, res, next) => {
        if (!req.isAuthenticated()) {
            req.session.returnTo = req.originalUrl //storing prevsious url
            req.flash("danger", "Must be logged in first")
            return res.redirect('/login')
        }
        next()
    }
    //validate currentUser for edit/delete campground
module.exports.isOwner = async(req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground.owner.equals(req.user._id)) {
        req.flash('danger', "You don't owns this post")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

//validate new,edit campground
module.exports.validateCampground = async(req, res, next) => {
    try {
        const value = await CampgroundSchema.validateAsync(req.body);
        next();
    } catch (e) {
        return res.status(404).render("campgrounds/error", { message: e });
    }
};

//validate new review
module.exports.validateReview = async(req, res, next) => {
    try {
        const value = await ReviewSchema.validateAsync(req.body);
        next()
    } catch (e) {
        return res.status(404).render("campgrounds/error", { message: e });
    }
}

//validate if current user is owner of the review to be deleted
module.exports.isReviewUser = async(req, res, next) => {
    const { id, review_id } = req.params
    const review = await Review.findById(review_id)
    if (!req.user._id.equals(review.owner)) {
        req.flash('danger', "permission to delete review denied")
        return res.redirect(`/campgorunds/${id}`)
    }
    next()
}