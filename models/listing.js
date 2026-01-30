const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image:{
        type: String,
        default: "lens-by-benji-sFEcIgnhxnw-unsplash.jpg",
        set: (v)=> v===undefined?"lens-by-benji-sFEcIgnhxnw-unsplash.jpg":v, 
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;