const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedin, isReviewUser } = require('../middleware')
const reviewController = require('../controller/review')

//add
router.post('/review', isLoggedin, validateReview, reviewController.addReview)

//delete review
router.delete('/reviews/:review_id', isLoggedin, isReviewUser, reviewController.deleteReview)


module.exports = router;