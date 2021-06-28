const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema

const imageSchema = mongoose.Schema({
    url: String,
    pathname: String
})

imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200')
})

const opts = { toJSON: { virtuals: true } }

const CampgroundsSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    images: [imageSchema],
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, opts)

CampgroundsSchema.virtual('properties.popUpMarkUp').get(function() {
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`
})

//for removing reviews form Review when a campgorund is deleted
CampgroundsSchema.post('findOneAndDelete', async function(doc) {
        if (doc) {
            await Review.deleteMany({
                _id: {
                    $in: doc.reviews
                }
            })
        }
    })
    // const Campground = mongoose.model('Campground',CampgroundsSchema)
    // module.exports = Campgrounds

module.exports = mongoose.model('Campground', CampgroundsSchema)