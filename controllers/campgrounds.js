const Campground = require("../models/campground");
const mapboxToken = process.env.MAPBOX_TOKEN;
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const { cloudinary } = require("../cloudinary");
// contains forward and reverse geocoding
const geocoder = mbxGeocoding({ accessToken: mapboxToken });

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCamp = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1
    })
    .send();

  const campground = new Campground(req.body.campground);
  // gives longitude, lattitude in geo json
  campground.geometry = geoData.body.features[0].geometry;

  // req.files is array of files with file info
  campground.images = req.files.map(file => ({
    url: file.path,
    filename: file.filename
  }));

  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "Successfully created new campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCamp = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    // populate reviews and the author of the reviews
    .populate({
      path: "reviews",
      populate: {
        path: "author"
      }
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "campground not found");
    res.redirect("/campgrounds");
  } else {
    res.render("campgrounds/show", { campground });
  }
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "campground not found");
    res.redirect("/campgrounds");
  } else res.render("campgrounds/edit", { campground });
};

module.exports.editCamp = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground
  });
  // imgs parsed by multer is an array so spread into images array on campground
  const imgs = req.files.map(file => ({
    url: file.path,
    filename: file.filename
  }));
  campground.images.push(...imgs);
  await campground.save();

  if (req.body.deleteImages) {
    const trimedDeleteImages = req.body.deleteImages.map(tImg => tImg.trim());
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: trimedDeleteImages } } }
    });
  }

  req.flash("success", "Successfully updated campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCamp = async (req, res) => {
  const { id } = req.params;

  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground");
  res.redirect("/campgrounds");
};
