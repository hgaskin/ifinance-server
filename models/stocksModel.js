const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

// Building the stock schema/model
const stockDataLayout = new mongoose.Schema({
    symbol: {type: String},
    company: {type: String},
    priceAtPurchase: {type: Number},
    sharesPurchased: {type: Number},
    description: {type: String},
    user: {type: ObjectId, required: true},
}, {
    timestamps: true
});

const StockData = mongoose.model("stockdata", stockDataLayout);

module.exports = StockData;