const express = require ('express');
const app = express();
const database = require('./utils/db.js');
var cookieSession = require('cookie-session');
const csurf = require('csurf');
const {hash, compare} = require("./utils/bc.js");





//////////////////////////////////////////////////
//            HANDLEBARS BOILERPLATE            //
// ///////////////////////////////////////////////
const hb = require('express-handlebars');
app.engine('handlebars', hb());
app.set('view engine', 'handlebars');

//////////////////////////////////////////////////
//               EXPRESS STATIC                 //
// ///////////////////////////////////////////////
app.use(express.static(__dirname + '/public'));
//////////////////////////////////////////////////
//            EXPRESS URL ENCODED               //
// ///////////////////////////////////////////////
app.use(express.urlencoded({extended: false}));
//////////////////////////////////////////////////
//               COOKIE SESSION                 //
// ///////////////////////////////////////////////
app.use(cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14
}));
//////////////////////////////////////////////////
//          Protecting Against CSRF             //
// ///////////////////////////////////////////////
app.use(csurf());
//////////////////////////////////////////////////
//                CSRF & MIDDLEWARE              //
// ///////////////////////////////////////////////
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.set('x-frame-options', 'DENY');
    next();
});






///////////////////////////////////////////////////////////////////////////////
//                                 GET - ROUTES                              //
///////////////////////////////////////////////////////////////////////////////


// ---------------------------------MAIN ROUTE -------------------------------//
app.get("/", (req, res) => {
    if (req.session.userId) {
        res.redirect("/petition/signed");
    } else {
    //redirecting all traffice to /petition page
        res.redirect("/registration");
    }
});
// -------------------------/REGSITRATION ROUTE ------------------------------//
app.get("/registration", (req, res) => {
    //rendering registration page using registration.handlebars
    res.render ("registration", {
        layout: "main",
    });
});
// ------------------------------/LOGIN ROUTE --------------------------------//
app.get("/login", (req, res) => {
    //rendering registration page using registration.handlebars
    res.render ("login", {
        layout: "main",
    });
});
// ------------------------------/PETIRION ROUTE -----------------------------//
app.get("/petition", (req, res) => {
    // Check for Cookie Session
    if (!req.session.userId) {
        res.redirect("/registration");

    } else {
        database.getSig(req.session.userId).then( results => {
            //if there is nothign in the result row
            if (results.rows.length == 0) {
                //rendering petition page using petition.handlebars
                res.render ("petition", {
                    layout: "main",
                    first: req.session.first,
                    last: req.session.last
                });
            } else {
                res.redirect("/petition/signed");
            }
        }).catch(err => console.log("Err in getSig on /login: ", err));
    }
});
// -------------------------/PETITION/SIGNED ROUTE ---------------------------//
app.get("/petition/signed", (req, res) => {
    //Check for Cookie Session
    if (!req.session.userId) {
        res.redirect("/registration");
    } else {
        //DB request to pull all data ROWS
        database.selectAllSigners().then(result => {
            //set a variable to rowCount
            let totalNumSignatures = result.rowCount;
            //NESTED DB Query to pull Signature of current User
            database.getSig(req.session.userId).then( results => {
                //SET VARIABLE TO STORE IMAGE
                let sigImage = results.rows[0].signature;
                //Rendering /peititon/signed page
                res.render("signed", {
                    layout: "main",
                    //passing data for Signature Count and Signature Image
                    totalNumSignatures: totalNumSignatures,
                    sigImage : sigImage,
                    first: req.session.first,
                    last: req.session.last
                });
            }).catch(err => console.log("Err in getSig in /petition/signed route: ", err));
        });
    }
});
// -------------------------/PETIRION/SIGNERS ROUTE ---------------------------//
app.get("/petition/signers", (req, res) => {
    if (!req.session.userId) {
        res.redirect("/registration");

    } else {
    //db request to pull all data on ROWS
        database.selectAllSigners()
            .then( result => {
                //variable to set all rows to pull first and last
                let allSigners = result.rows;
                //render signers page with first and last name of all signatures
                res.render("signers", {
                    layout: "main",
                    //passing data
                    allSigners
                });
            });
    }
});
// -----------------------------/PROFILE ROUTE -------------------------------//
app.get("/profile", (req, res) => {
    res.render("profile", {
        layout: "main",
    });
});






///////////////////////////////////////////////////////////////////////////////
//                              POST - ROUTES                                //
///////////////////////////////////////////////////////////////////////////////
// -------------------------POST /PETITION ROUTE ---------------------------//
app.post("/petition", (req, res) => {
    let {signature} = req.body;
    //If the body.signature is true do the following
    if (signature) {
        //DB.js request to INSERT DATA
        database.addSig(signature, req.session.userId)
            .then( () => {
                res.redirect("/petition/signed");
            })
            //if DB error occurs catch
            .catch(err => console.log(err));
    } else {
        res.render("petition", {
            layout: "main",
            first: req.session.first,
            last: req.session.last,
            error: "error"
        });
    }
});

// ----------------------POST /REGISTRATION ROUTE ---------------------------//
app.post("/registration", (req, res) => {
    const { first, last, email, password } = req.body;
    if (first && last && email && password) {
        hash(password)
            .then(hashedPassword => {
                console.log("Hashed Password from /registration: ", hashedPassword);
                database.createUser(first, last, email, hashedPassword)
                    .then(result => {
                        //SETTING COOKIE INFORMATION
                        req.session.userId = result.rows[0].id;
                        req.session.first = result.rows[0].first;
                        req.session.last = result.rows[0].last;
                        //Redirect to Profile
                        res.redirect('/profile');
                    }).catch(err => console.log("Err in createUser in /registration route", err));
            });
    } else {
        res.render("registration", {
            layout: "main",
            error: "error",
        });
    }
});
// ----------------------POST /PROFILE ROUTE ---------------------------//
app.post("/profile", (req, res) => {
    let {age, city, homepage} = req.body;

    if (age || city || homepage) {
        database.addProfile(age, city, homepage, req.session.userId)
            .then ( () => {
                res.redirect("/petition");
            }).catch(err => console.log("Err in addProfile: ", err));
    } else {
        res.redirect("/petition");
    }
});
// ----------------------POST /LOGIN ROUTE ---------------------------//
app.post("/login", (req, res) => {
    const {email, password} = req.body;
    database.getPassword(email)
        .then(results =>{
            //SETTING COOKIE INFORMATION
            req.session.userId = results.rows[0].id;
            req.session.first = results.rows[0].first;
            req.session.last = results.rows[0].last;
            //Compare() to check if Password is correct
            compare(password, results.rows[0].password).then( results =>{
                if (results) {
                    //If result retrun True - forward to Petition
                    res.redirect('/petition');
                } else {
                    //if results return false - reload with error message
                    res.render ("login", {
                        layout: "main",
                        error: "error"
                    });
                }
                console.log("Is the password correct: ", results);
            }).catch(err => console.log("Err in password compare() : ", err));
        }).catch(err => console.log("Err in getPassword : ",err));
});
///////////////////////////////////////////////////////////////////////////////
//                        SERVER LISTENING ON NODE.JS                        //
// ///////////////////////////////////////////////// //////////////////////////
app.listen(process.env.PORT || 8080, () => console.log("Petition Server is running!"));
