const express = require ('express');
const app = exports.app = express();
const database = require('./utils/db.js');
var cookieSession = require('cookie-session');
const csurf = require('csurf');
const { requireLoggedOutUser } = require('./utils/middleware.js');
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
//                                 MY ROUTES                                 //
///////////////////////////////////////////////////////////////////////////////
// ---------------MAIN, Login, Registration, Petition, Profile ROUTE ---------//
app.get("/", requireLoggedOutUser, (req, res) => {
    res.redirect("/registration");

});
require('./routes/auth');
require('./routes/petition');
require('./routes/profile');
require('./routes/delete');
// -----------------------------/LOGOUT ROUTE -------------------------------//
app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/login");
});
// -----------------------------/terms for 404 ROUTE -------------------------------//
app.get("/terms", (req, res) => {
    res.render ("terms", {
        layout: "main",
        loginPage: true
    });
});
// -----------------------------/* for 404 ROUTE -------------------------------//
app.get("*", (req, res) => {
    res.render ("404", {
        layout: "main",
    });
});

///////////////////////////////////////////////////////////////////////////////
//                        SERVER LISTENING ON NODE.JS                        //
// ///////////////////////////////////////////////// //////////////////////////
if (require.main === module){
    app.listen(process.env.PORT || 8080, () => console.log("Petition Server is running!"));
}
