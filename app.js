const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js")
const reviews = require("../Airbnb-Clone/routes/review.js")

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
    res.redirect("/listings");
});

//Express Router configuration
app.use("/listings",listings);

//Express Router configuration for reviews
app.use("/listings/:id/reviews",reviews)

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
