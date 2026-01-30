const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8080;
const Listing = require("./models/listing.js");
const path = require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL);
}

app.get("/",(req,res)=>{
    res.send("Hi i am root");
});

//Index Route
app.get("/listings",async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index",{allListings});
});

//Show Route
app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});

app.listen(port,()=>{
    console.log("Sever is listening at port: "+port);
});
