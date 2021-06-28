const express = require("express");
const router = express.Router();
const campgroundController = require('../controller/campground')
const { isLoggedin, validateCampground, isOwner } = require('../middleware')
const { storage } = require('../cloudinary/index')
const multer = require('multer')
const upload = multer({ storage })

router.route('/')
    .get(campgroundController.index)
    .post(isLoggedin, upload.array('image'), validateCampground, campgroundController.createCampground)
    // .post(upload.single('image'), (req, res) => {
    //     console.log(req.body, req.file)
    // })

//create
router.get("/new", isLoggedin, campgroundController.renderNewForm);

router.route('/:id')
    .get(campgroundController.showCampground)
    .put(isLoggedin, isOwner, upload.array('image'), validateCampground, campgroundController.updateCampground)
    .delete(isLoggedin, isOwner, campgroundController.deleteCampground)

//render edit
router.get("/:id/edit", isLoggedin, isOwner, campgroundController.editCampground);

module.exports = router;