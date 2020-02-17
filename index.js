const express = require ('express');
const app = express();
const db = require('./db');




//////////////////////////////////////////////////
//            EXPRESS WITH HANDLEBARS           //
// ///////////////////////////////////////////////
const hb = require('express-handlebars');
app.engine('handlebars', hb());
app.set('view engine', 'handlebars');

//////////////////////////////////////////////////
//                   MIDDLEWARE                 //
// ///////////////////////////////////////////////
app.use(express.urlencoded({extended: false}));

app.use((req, res, next) => {
    console.log("Middleware is Running!");
    next();
});

//////////////////////////////////////////////////
//                     STATIC                   //
// ///////////////////////////////////////////////
app.use(express.static(__dirname + '/public'));


//////////////////////////////////////////////////
//                     ROUTES                   //
// ///////////////////////////////////////////////
app.get("/", (req, res) => {
    console.log("Request for / Route");
    res.redirect("/petition");
});

//Main requst for PETITION and rendering using Petition.HANDLEBARS
app.get("/petition", (req, res) => {
    console.log("Request for /petition Route");
    res.render ("petition", {
        layout: "main",
    });
});

//Main requst for PETITION and rendering using Petition.HANDLEBARS
app.post("/petition", (req, res) => {
    if (req.body.signature) {
        db.addSig(req.body.first, req.body.last, req.body.signature)
            .then(result => {
                console.log("Results: ", result);
                res.redirect("/thanks");
            })
            .catch(err => console.log(err));
    } else {
        res.render("petition", {
            layout: "main",
            error: "error",
        });
    }
});



































//////////////////////////////////////////////////
//          SERVER LISTENING ON NODE.JS         //
// ///////////////////////////////////////////////
app.listen(8080, () => console.log("Petition Server is running!"));
