const router = require("express").Router();
const StockData = require("../models/stocksModel");
const auth = require("../middleware/auth");

const https = require("https");
const url = require("url");


// ================ Get Stocks from MyPortfolio with user Auth =============== //

router.get("/", auth, async (req, res) => {
    try {
        console.log(req.user);
        const portfolio = await StockData.find({user: req.user });
        res.json(portfolio);
    }
    catch(err) {
        res.status(500).send();
    }
});

// ================ Add Stock to MyPortfolio with user Auth =============== //

router.post("/", auth, async (req, res) => {
    try {
        const {symbol, company, priceAtPurchase, sharesPurchased, description} = req.body;
        console.log(req.body);

        //VALIDATION

        if (!symbol && !company && !priceAtPurchase) {
            return res.status(400).json({ errorMessage: "Please enter a stock Ticker, Company Name, and Price."});
        }

        const addStockInfo = new StockData({
            symbol,
            company,
            priceAtPurchase,
            sharesPurchased,
            description,
            user: req.user,
        });

        // once PROMISE has been resolved, pause..., then continue
        const savedStockInfo = await addStockInfo.save();

        res.json(savedStockInfo);
    }
    catch(err) {
        res.status(500).send();
    }   
});

// ================ UPDATE Stocks from MyPortfolio =============== //

router.put("/:id", auth, async (req, res) => {
    try {
        const {symbol, company, priceAtPurchase, sharesPurchased, description} = req.body;
        const stockId = req.params.id;
        console.log(stockId);

        // VALIDATION ... what if there isnt an ID selected. catches potential front end error. //

        if (!symbol && !company) {
            return res.status(400).json({ errorMessage: "Please enter a stock Ticker, Company Name, and Price."});
        }

        if (!stockId) {
            return res.status(400).json({ errorMessage: "Stock ID not found...please contact support"});
        }
        const originalStock = await StockData.findById(stockId);

        if (!originalStock) {
            return res.status(400).json({ errorMessage: "Stock ID not found... please contact developer"});
        }

        if (originalStock.user.toString() !== req.user) {
            return res.status(401).json({ errorMessage: "Unauthorized."});
        }

       originalStock.symbol = symbol;
       originalStock.company = company;
       originalStock.priceAtPurchase = priceAtPurchase;
       originalStock.sharesPurchased = sharesPurchased;
       originalStock.description = description;

       const updatedStock = await originalStock.save();

       res.json(updatedStock);

    }
    catch(err) {
        res.status(500).send();
    }
});


// ================ DELETE Stocks from MyPortfolio =============== //

router.delete("/:id", auth, async (req, res) => {
    try {
        const stockId = req.params.id;
        console.log(stockId);

    // VALIDATION ... what if there isnt an ID selected. catches potential front end error. //

        if(!stockId) {
            return res.status(400).json({ errorMessage: "Stock ID not found...please contact support"});
        }
        const existingStock = await StockData.findById(stockId);

        if(!existingStock) {
            return res.status(400).json({ errorMessage: "Stock ID not found... please contact developer"});
        }

    // check if user is logged in before delete
        if (existingStock.user.toString() !== req.user) {
            return res.status(401).json({ errorMessage: "Unauthorized."});
        }

    // delete stock
        await existingStock.delete();

    //tell user which stock has been deleted
        res.json(existingStock);

    }
    catch(err) {
        res.status(500).send();
    }
});

module.exports = router;