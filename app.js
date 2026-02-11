const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8080;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");

app.engine('ejs',ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

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

//Server side validation Middleware
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.detail.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    }else{
        next();
    }
};

//Index Route
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index",{allListings});
}));

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new");
});

//New Route should be ABOVE Show Route or else the show route will be executed and /new of /listings/new will be treated as a "id" and will be searched in the database which will lead to an FATAL error

//Create Route (Post Request)
app.post(
    "/listings",validateListing,
    wrapAsync(async(req,res,next)=>{
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    })
);

//Edit Route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit",{listing});
}));

//Update Route
app.put("/listings/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings")
}));

//Show Route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show",{listing});
}));

app.all(/.*/,(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

//Error Handling Middleware
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something Went Wrong"} = err;
    res.status(statusCode).render("error.ejs",{message});
});

app.listen(port,()=>{
    console.log("Sever is listening at port: "+port);
});
