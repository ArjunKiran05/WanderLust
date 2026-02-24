const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");


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
router.get("/",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index",{allListings});
}));

//New Route
router.get("/new",(req,res)=>{
    res.render("listings/new");
});

//New Route should be ABOVE Show Route or else the show route will be executed and /new of /listings/new will be treated as a "id" and will be searched in the database which will lead to an FATAL error

//Create Route (Post Request)
router.post("/lisings",validateListing,wrapAsync(async(req,res,next)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit",{listing});
}));

//Update Route
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings")
}));

//Show Route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show",{listing});
}));

module.exports = router;