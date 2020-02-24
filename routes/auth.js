const {app} = require('../index');
const {requireLoggedOutUser} = require('../utils/middleware.js');
const {hash, compare} = require("../utils/bc.js");
const database = require('../utils/db.js');



///////////////////////////////////////////////////////////////////////////////
//                              REGISTRATION                                 //
///////////////////////////////////////////////////////////////////////////////
// ---------------------------------GET --------------------------------------//
app.get("/registration",  requireLoggedOutUser,  (req, res) => {
    //rendering registration page using registration.handlebars
    res.render ("registration", {
        layout: "main",
        registration: true
    });
});
// ---------------------------------POST--------------------------------------//
app.post("/registration", requireLoggedOutUser,  (req, res) => {
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
                        //Redirect to Profile
                        res.redirect('/profile');
                    }).catch(err => {
                        console.log("Err in createUser in /registration route", err);
                        res.render("registration", {
                            layout: "main",
                            registration: true,
                            emailError: true
                        });
                    });
            });
    } else {
        res.render("registration", {
            layout: "main",
            registration: true,
            error: "error",
        });
    }
});
///////////////////////////////////////////////////////////////////////////////
//                                    LOGIN                                   //
///////////////////////////////////////////////////////////////////////////////
// ------------------------------------GET------------------------------------//
app.get("/login", requireLoggedOutUser,  (req, res) => {
    //rendering registration page using registration.handlebars
    res.render ("login", {
        layout: "main",
        loginPage: true
    });
});
// -----------------------------------POST -----------------------------------//
app.post("/login",  requireLoggedOutUser, (req, res) => {
    const {email, password} = req.body;
    database.getPassword(email)
        .then(results =>{
            //Compare() to check if Password is correct
            //SETTING COOKIE INFORMATION
            req.session.userId = results.rows[0].id;
            req.session.first = results.rows[0].first;
            req.session.last = results.rows[0].last;
            compare(password, results.rows[0].password).then( results =>{
                if (results) {
                    //If result retrun True - forward to Petition
                    res.redirect('/petition');
                } else {
                    //if results return false - reload with error message
                    req.session.userId = null;
                    res.render ("login", {
                        layout: "main",
                        loginPage: true,
                        error: "error"
                    });
                }
                console.log("Is the password correct: ", results);
            }).catch(err => console.log("Err in password compare() : ", err));
        }).catch(err =>{
            console.log("Err in getPassword : ",err);
            res.render ("login", {
                layout: "main",
                loginPage: true,
                wrongId: true
            });
        });
});
