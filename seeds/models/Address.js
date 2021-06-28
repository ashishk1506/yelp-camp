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

const addressSchema = new mongoose.Schema({
    name : String,
    addresses :[
        {
            city : String,
            state : String,
            country : String
        }
    ]
})

const Address = mongoose.model('Address',addressSchema)

const addAddr = async () =>{
    const user = await new Address({
        name : 'ashish'
    })
    user.addresses.push({
        city : 'Bokaro',
        state : 'Jharkhand',
        country : 'India'
    })
    user.save()
}
addAddr()
//one to few