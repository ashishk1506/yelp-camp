const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/models", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});


const userSchema = mongoose.Schema({
    name : String,
    age : Number
    // tweets : [{

    // }]
})
const tweetSchema = mongoose.Schema({
    tweet : String,
    likes : Number,
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User' //model
    }
})

const User = mongoose.model('User',userSchema)
const Tweet = mongoose.model('Tweet', tweetSchema) 

// const makeUser = async ()=>{
//     const u = new User({
//         name :'Ashish',
//         age : 22
//     })
//     u.save()
// }
// makeUser()

const maketTweet = async ()=>{
    const u = await User.findOne({ name:'Ashish' })
    const tweet = new Tweet({
        tweet  :"hi i am assassin",
        likes  :100,
        owner : u
    })
    tweet.save()
}
// maketTweet()

const findTweet = async ()=>{
    const t = await Tweet.find({}).populate('owner') //key used in schema
    // const t = await Tweet.find({}).populate('owner','name')
    console.log(t)
}
findTweet()

// Tweet.deleteMany({}).then((data)=>{
//     console.log(data)
// })

//twert(parent)<-user