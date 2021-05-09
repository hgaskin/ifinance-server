const mongoose = require("mongoose");

// Building the stock schema/model
const stockDataLayout = new mongoose.Schema({
    ticker: {type: String},
    company: {type: String},
    price: {type: Number},
    description: {type: String}
}, {
    timestamps: true
});

const StockData = mongoose.model("stockdata", stockDataLayout);

module.exports = StockData;