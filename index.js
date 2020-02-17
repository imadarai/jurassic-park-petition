const express = require ('express');
const app = express();
const database = require('./utils/db.js');
var cookieSession = require('cookie-session');
const csurf = require('csurf');
// const {hash, compare} = require("./utils/bc.js");





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
    next();
});






//////////////////////////////////////////////////
//                GET - ROUTES                  //
// ///////////////////////////////////////////////

// ---------------------------------MAIN ROUTE -------------------------------//
app.get("/", (req, res) => {
    //redirecting all traffice to /petition page
    res.redirect("/petition");
});
// ------------------------------/PETIRION ROUTE -----------------------------//
app.get("/petition", (req, res) => {
    //Check for Cookie Session
    if (req.session.userId) {
        res.redirect("/petition/signed");

    } else {
        //rendering petition page using petition.handlebars
        res.render ("petition", {
            layout: "main",
        });

    }
});
// -------------------------/PETITION/SIGNED ROUTE ---------------------------//
app.get("/petition/signed", (req, res) => {
    //Check for Cookie Session
    if (!req.session.userId) {
        res.redirect("/petition");
    } else {
        //DB request to pull all data ROWS
        database.selectAll().then(result => {
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
                    sigImage : sigImage
                });
            }).catch(err => console.log(err));
        });
    }
});
// -------------------------/PETIRION/SIGNERS ROUTE ---------------------------//
app.get("/petition/signers", (req, res) => {
    if (!req.session.userId) {
        res.redirect("/petition");

    } else {
    //db request to pull all data on ROWS
        database.selectAll()
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





//////////////////////////////////////////////////
//                POST - ROUTES                 //
// ///////////////////////////////////////////////
// -------------------------POST /PETITION ROUTE ---------------------------//
app.post("/petition", (req, res) => {
    let {first, last, signature} = req.body;
    //If the body.signature is true do the following
    if (first && last && signature) {
        //DB.js request to INSERT DATA
        database.addSig(first, last, signature)
            .then( dataFromDB => {
                //RETURNING USER ID FROM DB AND STORING IN COOKIE
                const userId = dataFromDB.rows[0].id;
                req.session.userId = userId;
                //After successful request redirect to signed
                res.redirect("/petition/signed");
            })
            //if DB error occurs catch
            .catch(err => console.log(err));
    } else {
        res.render("petition", {
            layout: "main",
            error: "error",
        });
    }
});


// app.post('/register', (req, res) => {
//     //you will want to grav the user password provided, i.r. sht like req.body.Password
//     //USE hash to take user input created ithe hased version of PW to stroe in debug
//     hash('password').then(hashedPW => {
//         console.log("hasedPW from /register,", hashedPW);
//         //you are going to want to stoer this in your DB table
//
//         res.sendStatus(200);
//         //you will want o redurec and not send a success status
//     });
// });
//
// app.post('/login', (req, res) => {
//     //here you will want ot use compare, compare takes two argument, 1st is the
//     // password privded by user and second is the hashedpw from DB
//     //If these passwords match compare returns true, otherqise it returns falase
//     const hashFromDb = 'test';
//     compare('userInput', hashFromDb).then( matchValue => {
//         console.log("matchValue of compare: ", matchValue);
//
//         res.sendStatus(200);
//     });
//     //if the PW matche you will want to redurec to /petition, will want to set req.session.userID
//     //if PW does not match we will want to trigger or send and error msg
// });


//////////////////////////////////////////////////
//          SERVER LISTENING ON NODE.JS         //
// ///////////////////////////////////////////////
app.listen(8080, () => console.log("Petition Server is running!"));
