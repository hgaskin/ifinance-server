const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");


router.post("/", async (req, res) => {
    try {
       const {email, password, passwordVerify } = req.body;

    // 1. Validation

       if ( !email || !password || !passwordVerify ) {
           return res
            .status(400)
            .json({
                errorMessage:
                "Error with information entered.",
            });
       }

    // 2. Password verification 

       if (password.length < 6) {
           return res.status(400).json({
               errorMessage: "Please enter password of at least 6 characters",
           });
       }

       if (password !== passwordVerify) {
            return res.status(400).json({
                errorMessage: "Please enter matching passwords",
            });
        }

    // 3. Make sure no account exists for this email 

        const existingUser = await User.findOne({email: email});
        console.log(existingUser);

        if (existingUser) {
            return res.status(400).json({
                errorMessage: "User already exists with this email.",
            });
        }

    // 4. Hash password using BCRYPT JS =======

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        console.log(passwordHash);

    // 5. save user in the database MONGO DB ==========

        const newUser = new User({
            email,
            passwordHash: passwordHash
        });

        const savedUser = await newUser.save();

    // 6. create JWT token to send login user to server using npm i 'jsonwebtoken' ==========

        const token = jwt.sign({
            id: savedUser._id
        }, process.env.JWT_SECRET);

    // 7. send information as cookie =======

        res.cookie("token", token, {
            httpOnly: true,
            sameSite:
                process.env.NODE_ENV === "development"
                ? "lax"
                : process.env.NODE_ENV === "production" && "none",
            secure:
                process.env.NODE_ENV === "development"
                ? false 
                : process.env.NODE_ENV === "production" && true,
             })
             .send();
    
    } catch(err) {
        res.status(500).send();
    }
});

// ============= LOGIN path ==========

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
 
     // 1. Validation
 
        if ( !email || !password ) {
            return res
             .status(400)
             .json({
                 errorMessage:
                 "Error with information entered.",
             });
        }
 
     // 2. GET user account for this email 
 
         const existingUser = await User.findOne({email: email});
         console.log(existingUser);
 
         if (!existingUser) {
             return res.status(401).json({
                 errorMessage: "Wrong Email or Password.",
             });
         }

    // 3. use bcrypt to decypher password hash

         const correctPasword = await bcrypt.compare(password, existingUser.passwordHash);

         if (!correctPasword) {
            return res.status(401).json({
                errorMessage: "Wrong Email or Password.",
            });
         }
 
     // 4. create JWT token to send login user to server using npm i 'jsonwebtoken' ==========
 
         const token = jwt.sign(
            {
                id: existingUser._id
            }, 
                process.env.JWT_SECRET
            );
 
     // 7. send information as cookie =======
 
         res.cookie("token", token, {
             httpOnly: true,
             sameSite:
             process.env.NODE_ENV === "development"
             ? "lax"
             : process.env.NODE_ENV === "production" && "none",
         secure:
             process.env.NODE_ENV === "development"
             ? false 
             : process.env.NODE_ENV === "production" && true, 
            })
             .send();
 
     } catch(err) {
         res.status(500).send();
     }
})

// 8. detect if someone is logged in , return user id and token .

router.get("/loggedIn", (req, res) => {
    try {
        const token = req.cookies.token;

        if(!token) return res.json(null);

        const validatedUser = jwt.verify(token, process.env.JWT_SECRET);
        
        res.json(validatedUser.id);

    } catch(err) {
        return res.json(null);
    }  

});

// 9. logout request for user to clear the cookie =========
    router.get("/logOut", (req, res) => {
        try {
            res.cookie("token", "", {
                httpOnly: true,
            sameSite:
                process.env.NODE_ENV === "development"
                ? "lax"
                : process.env.NODE_ENV === "production" && "none",
            secure:
                process.env.NODE_ENV === "development"
                ? false 
                : process.env.NODE_ENV === "production" && true,
            expires: new Date(0),
            }).send();
        } catch (err) {
            return res.json(null);
        }
    });

module.exports = router;