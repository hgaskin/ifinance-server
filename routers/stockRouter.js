const router = require("express").Router();
const StockData = require("../models/stocksModel");


// ================ Get Stocks from MyPortfolio =============== //

router.get("/", async (req, res) => {
    try {
        const portfolio = await StockData.find();
        console.log(portfolio);
        res.send(portfolio);
    }
    catch(err) {
        res.status(500).send();
    }
});

// ================ Add Stock to MyPortfolio =============== //

router.post("/", async (req, res) => {
    try {
        const {ticker, company, price, description} = req.body;
        console.log(req.body);

        //VALIDATION

        if (!ticker && !company && !price) {
            return res.status(400).json({ errorMessage: "Please enter a stock Ticker, Company Name, and Price."});
        }

        const addStockInfo = new StockData({
            ticker, company, price, description
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

router.put("/:id", async (req, res) => {
    try {
        const {ticker, company, price, description} = req.body;
        const stockId = req.params.id;
        console.log(stockId);

        // VALIDATION ... what if there isnt an ID selected. catches potential front end error. //

        if (!ticker && !company && !price) {
            return res.status(400).json({ errorMessage: "Please enter a stock Ticker, Company Name, and Price."});
        }

        if(!stockId) {
            return res.status(400).json({ errorMessage: "Stock ID not found...please contact support"});
        }
        const originalStock = await StockData.findById(stockId);

        if(!originalStock) {
            return res.status(400).json({ errorMessage: "Stock ID not found... please contact developer"});
        }

       originalStock.ticker = ticker;
       originalStock.company = company;
       originalStock.price = price;
       originalStock.description = description;

       const updatedStock = await originalStock.save();

       res.json(updatedStock);

    }
    catch(err) {
        res.status(500).send();
    }
});


// ================ DELETE Stocks from MyPortfolio =============== //

router.delete("/:id", async (req, res) => {
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