const express = require("express");
const mongoose = require("mongoose");

const dotenv = require("dotenv");

const cors = require("cors");

// parse cookie data
const cookieParser = require("cookie-parser");
const { get } = require("./routers/userRouter");

dotenv.config();

// setup express server

const app = express();

//Setup CORS to allow CROSS ORIGIN >>>> "app.use(cors());" <<<< commmunication between Server and Client side of APP ///

app.use(express.json());
// ================ Middleware =======
app.use( 
    cors({
        origin: ["http://localhost:3000", "https://ifinance-hgaskin.netlify.app"],
        credentials: true,
    })
);

app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server (backend) started on port: ${PORT}`));

//setting up a GET request

// setting up Routers MiddleWare

app.use("/stock_data", require("./routers/stockRouter"));
app.use("/auth", require("./routers/userRouter"));

// Connect to MongoDB

mongoose.connect(process.env.MDB_CONNECT_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) return console.log(err);
    console.log("Connected to MongoDB Database :)");
});
