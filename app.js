const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8080;
const Listing = require("./models/listing.js");

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

app.get("/testListing",async (req,res)=>{
    let sampleListing = new Listing({
        title: "My new Villa",
        description: "by the beach",
        price: 1200,
        location: "Goa",
        country: "India",
    });
    await sampleListing.save();
    console.log("Sample was saved");
    res.send("Successful");
});

app.listen(port,()=>{
    console.log("Sever is listening at port: "+port);
});
