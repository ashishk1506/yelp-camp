const mongoose = require("mongoose");
const Campground = require("../models/campgrounds");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});

const randArr = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
};

const seedDB = async() => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const rand = Math.floor(Math.random() * cities.length);
        const price = Math.floor(Math.random() * 20) + 5
        const camp = new Campground({
            location: `${cities[rand].city}, ${cities[rand].state}`,
            title: `${randArr(descriptors)} ${randArr(places)}`,
            image: "https://source.unsplash.com/random",
            price: price,
            owner: '60d64755bf3f9b485cd96aa9',
            images: [{
                url: 'https://res.cloudinary.com/dgdfcrqx4/image/upload/v1624797333/yelpCamp/lnxva9mme5zmlxurbbdv.jpg',
                pathname: 'yelpCamp/lnxva9mme5zmlxurbbdv'
            }],
            geometry: {
                type: 'Point',
                coordinates: [cities[rand].longitude, cities[rand].latitude]
            },
            description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam suscipit inventore impedit culpa ab cupiditate velit alias quia repellat cumque! Quae magni numquam similique neque odio nulla, ipsum sunt dolorem quam, aperiam reprehenderit obcaecati necessitatibus dolore harum dolorum reiciendis fugit nobis accusamus earum illo laborum. Quis sequi quae illum velit?",
        });
        await camp.save();
    }
};
seedDB().then(() => {
    mongoose.connection.close();
});