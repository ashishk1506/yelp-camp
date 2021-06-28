require('dotenv').config()
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const AppError = require("./AppError");
const campgroundRoutes = require("./routes/campgroundRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoute")
const session = require("express-session");
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const url = require('./url');
const db_url = process.env.db_url || "mongodb://localhost:27017/yelp-camp"
const MongoStore = require('connect-mongo');

// const MongoDBStore = require("connect-mongo")


mongoose.connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useUnifiedTopology: true,
    useFindAndModify: false, //deprication error
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.use(
    mongoSanitize({
        replaceWith: '_',
    }),
);

// const store = new MongoDBStore({
//     url: db_url,
//     secret: 'ashish0',
//     touchAfter: 24 * 60 * 60 //seconds
// })
// store.on("error", (e) => {
//     console.log("session error", e)
// })

const sessionConfig = {
    store: MongoStore.create({
        mongoUrl: db_url,
        secret: process.enc.SECRET || 'ashish0',
        touchAfter: 24 * 60 * 60
    }),
    name: 'cok',
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};
app.use(session(sessionConfig));
app.use(flash())
app.use(helmet());

const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...url.connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...url.scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...url.styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dgdfcrqx4/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //store
passport.deserializeUser(User.deserializeUser()); //unstore


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
    // console.log(req.session)
    res.locals.currentUser = req.user //from passport
        // if(req.user && req.user._id){
        //   console.log(req.user._id)
        // }
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('danger')
    next()
})

app.get("/", (req, res) => {
    res.render('home')
});

app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id", reviewRoutes);

app.use((err, req, res, next) => {
    const { status = 500, message = "Something Went Wrong" } = err;
    res.status(status).send(message);
});

app.all("*", (req, res, next) => {
    res.status(404).render("campgrounds/error", { message: "page not found " });
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("listening to port 3000");
});

// app.get("/secret",verifyPassword, (req, res) => {
//   res.send("secret revealed");
// });
//not found
// app.use((req, res) => {
//   res.send("not found");
// });

// const verifyPassword =  (req, res, next) => {
//   const { secret } = req.query;
//   if (secret === "ashish") return next();
//   else res.send("wrong");
// };