const express = require ('express');
const app = exports.app = express();
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
// ----------------------SUPER TEST DUMMY ROUTES ----------------------------//
// app.get("/welcome", (req, res) => {
//     res.send("<h1>hwelllwooowowowowo</h1>");
// });
//
// app.post("/welcome", (req, res) => {
//     res.session.submitted = true;
//     res.redirect('/home');
// });
//
// app.get("/home", (req, res) => {
//     if (!req.session.submitted) {
//         return res.redirect('/welcome');
//     }
//     res.send("<h1>home</h1>");
// });

// ---------------------------------MAIN ROUTE -------------------------------//
app.get("/", (req, res) => {
    res.redirect("/registration");

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
            }).catch(err => console.log("Err in selectAllSigners on /petition/signers: ", err));
    }
});
// -----------------------/SIGNERS/:CITY ROUTE -------------------------------//
app.get("/petition/signers/:city", (req, res) => {
    if (!req.session.userId) {
        res.redirect("/registration");
    } else {
        database.filterByCity(req.params.city)
            .then( result => {
                let allSigners = result.rows;
                res.render("signers", {
                    layout: "main",
                    allSigners
                });
            }).catch(err => {console.log("Err in filterByCity on req.param route: ", err);
            });
    }
});
// -----------------------------/PROFILE ROUTE -------------------------------//
app.get("/profile", (req, res) => {
    res.render("profile", {
        layout: "main",
    });
});
// -----------------------------/PROFILE/EDIT ROUTE -------------------------------//
app.get("/profile/edit", (req, res) => {
    database.selectProfileById(req.session.userId)
        .then( result => {
            //variable to set all rows to pull first and last
            let profileInfo = result.rows;
            //render signers page with first and last name of all signatures
            res.render("editprofile", {
                layout: "main",
                //passing data
                profileInfo
            });
        }).catch(err => console.log("Err in selectAllSigners on /profile/edit ", err));
});
// -----------------------------/DELETE ROUTE -------------------------------//
app.get("/delete", (req, res) => {
    database.deleteSignature(req.session.userId)
        .then(database.deleteProfile(req.session.userId)
            .then(database.deleteUser(req.session.userId))
            .catch(err => console.log("Err in deleting profile: ", err))
        );
    res.redirect("/logout");
});
// -----------------------------/LOGOUT ROUTE -------------------------------//
app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/registration");
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
// -------------------------POST /PETITION ROUTE ---------------------------//
app.post("/petition/signed", (req, res) => {
    database.deleteSignature(req.session.userId).then(() => {
        res.redirect("/petition");
    });
});

// ----------------------POST /REGISTRATION ROUTE ---------------------------//
app.post("/registration", (req, res) => {
    const { first, last, email, password } = req.body;
    if (first && last && email && password) {
        hash(password)
            .then(hashedPassword => {
                database.createUser(first, last, email, hashedPassword)
                    .then(result => {
                        //SETTING COOKIE INFORMATION
                        req.session.userId = result.rows[0].id;
                        req.session.first = result.rows[0].first;
                        req.session.last = result.rows[0].last;
                        req.session.password = result.rows[0].password;
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

    if (!age && !city && !homepage) {
        res.redirect('/petition');
    } else {
        if (homepage){
            if(!homepage.startsWith("http://") && !homepage.startsWith("https://") && !homepage.startsWith("//")){
                return res.render("profile", {
                    layout: "main",
                    error: "error"
                });
            }
        }
        database.addProfile(age, city, homepage, req.session.userId)
            .then ( () => {
                res.redirect("/petition");
            }).catch(err => console.log("Err in addProfile: ", err));
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
            req.session.password = results.rows[0].password;
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
// ----------------------POST /PROFILE/EDIT ROUTE ----------------------------//
app.post("/profile/edit", (req, res) => {
    let {first, last, email, password, age, city, homepage} = req.body;
    if (!password) {
        database.updateUserTable(first, last, email, req.session.password ,req.session.userId)
            .then ( () => {
                database.updateProfileTable(age, city, homepage, req.session.userId);
            }).then( () => {
                res.render("editprofile", {
                    layout: "main",
                    //passing data
                    status: "successfullyUpdated"
                });
            }).catch(err =>{
                console.log("Err in profile update with no Password : ", err);
                res.render("editprofile", {
                    layout: "main",
                    //passing data
                    error: "error"
                });
            }
            );

    } else {
        hash(password).then(hashedPassword => {
            database.updateUserTable(first, last, email, hashedPassword, req.session.userId)
                .then ( () => {
                    database.updateProfileTable(age, city, homepage, req.session.userId);
                }).then( () => {
                    res.render("editprofile", {
                        layout: "main",
                        //passing data
                        status: "successfullyUpdated"
                    });
                }).catch(err =>{
                    console.log("Err in profile update with no Password : ", err);
                    res.render("editprofile", {
                        layout: "main",
                        //passing data
                        error: "error"
                    });
                }
                );
        });
    }
});
///////////////////////////////////////////////////////////////////////////////
//                        SERVER LISTENING ON NODE.JS                        //
// ///////////////////////////////////////////////// //////////////////////////
if (require.main === module){
    app.listen(process.env.PORT || 8080, () => console.log("Petition Server is running!"));
}
