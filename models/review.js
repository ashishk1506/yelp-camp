const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reviewSchema = new Schema({
    rating : Number,
    body : String,
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
})

// const Campground = mongoose.model('Campground',CampgroundsSchema)
// module.exports = Campgrounds

module.exports = mongoose.model('Review', reviewSchema)