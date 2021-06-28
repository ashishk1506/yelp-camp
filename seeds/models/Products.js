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

const productSchema = new mongoose.Schema({
    name  : String,
    price  : Number,
    season : {
        type : String,
        enum  :['Summer','Spring','Fall','Winter']
    }
})
//important
const farmSchema = new mongoose.Schema({
    name  : String,
    location : String,
    products :[
        {
            type  : mongoose.Schema.Types.ObjectId,
            ref : 'Product'
        }
    ]
})

const Product = mongoose.model('Product',productSchema)
const Farm = mongoose.model('Farm',farmSchema)

// Product.insertMany([{
//     name : 'Apple',
//     price : 3,
//     season : 'Summer'
// },{
//     name : 'banana',
//     price  :4,
//     season : 'Winter'
// },{
//     name : 'papaya',
//     price : 5,
//     season : 'Spring'
// }])
const makeFarm = async () =>{
    const f = new Farm({
        name : 'farmsted',
        location : 'Boston',
    })
    const p = await Product.findOne({name:'Apple'})
    f.products.push(p)
    f.save()

}
makeFarm()
Farm.findOne({
    name : 'farmsted'
}).populate('products').then((data)=>{
    console.log(data)
})
// Farm.deleteMany({}).then((d)=>{
//     console.log(d)
// })

//used for one to many(100)
//farm(parent)<-product