const Campground = require("../models/campgrounds");
const Review = require('../models/review')

module.exports.addReview = async(req, res) => {
    try {
        const campground = await Campground.findById(req.params.id)
        const review = new Review(req.body.review)
        review.owner = req.user
        campground.reviews.push(review)
        await campground.save()
        await review.save()
        req.flash("success", "review added success");
        res.redirect(`/campgrounds/${campground._id}`)
    } catch (e) {
        return res.status(404).render("campgrounds/error", { message: e.stack });
    }
}

module.exports.deleteReview = async(req, res) => {
    const { id, review_id } = req.params
    await Review.findByIdAndDelete(review_id) //from review
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: review_id } }) //pull from reviews array
    req.flash("success", "review deleted success");
    res.redirect(`/campgrounds/${id}`)
}