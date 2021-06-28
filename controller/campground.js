const Campground = require("../models/campgrounds");
const { cloudinary } = require('../cloudinary/index')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN })


module.exports.index = async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
}

module.exports.createCampground = async(req, res) => {
    // const { title, price, description, location, image } = req.body.campground;
    try {
        const geoData = await geocoder.forwardGeocode({
            query: req.body.campground.location,
            limit: 1
        }).send()
        const newCampground = new Campground(req.body.campground);
        newCampground.geometry = geoData.body.features[0].geometry
        newCampground.owner = req.user
        const images = req.files.map((img) => {
            return ({
                url: img.path,
                pathname: img.filename
            })
        })
        newCampground.images = images
        await newCampground.save();
        req.flash("success", "Campground Added Successfully!!!!");
        res.redirect(`/campgrounds/${newCampground._id}`);
    } catch (e) {
        console.log("form databasse");
        return res.status(404).render("campgrounds/error", { message: e });
    }
}

module.exports.showCampground = async(req, res, next) => {
    try {
        const campground = await Campground.findById(req.params.id).populate({
                path: 'reviews',
                populate: {
                    path: 'owner'
                }
            }).populate('owner') //populating owner inside reviews
        if (!campground) {
            // return next(new AppError('campgound does not exist',404))
            // return res
            //   .status(404)
            //   .render("campgrounds/error", { message: "Does not exist" });
            req.flash("danger", "Campground not found");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/show", { campground });
    } catch (e) {
        return res.status(404).render("campgrounds/error", { message: e.stack });
    }
}

module.exports.editCampground = async(req, res) => {
    try {
        const campground = await Campground.findById(req.params.id);
        if (!campground) {
            req.flash("danger", "Campground not found");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/edit", { campground });
    } catch (e) {
        return res.status(404).render("campgrounds/error", { message: e.stack });
    }
}

module.exports.updateCampground = async(req, res) => {
    try {
        // console.log(req.body.campground)
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, {
            ...req.body.campground,
        });
        if (!campground) {
            req.flash("danger", "Campground not found");
            return res.redirect("/campgrounds");
        }
        const imagesArr = req.files.map((img) => {
            return ({
                url: img.path,
                pathname: img.filename
            })
        })
        campground.images.push(...imagesArr)
        await campground.save()
        if (req.body.deleteImages) {
            for (let filename of req.body.deleteImages) {
                await cloudinary.uploader.destroy(filename)
            }
            await await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        }
        req.flash("success", "Campground updated");
        res.redirect(`/campgrounds/${campground._id}`);
    } catch (e) {
        return res.status(404).render("campgrounds/error", { message: e.stack });
    }
}

module.exports.deleteCampground = async(req, res) => {
    try {
        const { id } = req.params;
        const campground = await Campground.findByIdAndDelete(id); //triggers mongosse middleware in csmpgorund schema
        //works only with findOneAndDelete middleware
        for (let image of campground.images) {
            await cloudinary.uploader.destroy(image.filename);
        }
        req.flash("success", "Campground Deleted");
        res.redirect("/campgrounds");
    } catch (e) {
        return res.status(404).render("campgrounds/error", { message: e.stack });
    }
}