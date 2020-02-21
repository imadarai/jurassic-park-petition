const {app} = require('../index');
const {requireLoggedInUser} = require('../utils/middleware.js');
const database = require('../utils/db.js');



///////////////////////////////////////////////////////////////////////////////
//                              PETITION ROUTES                               //
///////////////////////////////////////////////////////////////////////////////
// -----------------------------------GET------------------------------------//
app.get("/petition", requireLoggedInUser, (req, res) => {
    // Check for Cookie Session
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
});
// ----------------------------------POST------------------------------------//
app.post("/petition", requireLoggedInUser, (req, res) => {
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





///////////////////////////////////////////////////////////////////////////////
//                          PETITION/SIGNED ROUTES                           //
///////////////////////////////////////////////////////////////////////////////
// ----------------------------------GET -------------------------------------//
app.get("/petition/signed", requireLoggedInUser, (req, res) => {
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
});
// ----------------------------------POST-------------------------------------//
app.post("/petition/signed", requireLoggedInUser, (req, res) => {
    database.deleteSignature(req.session.userId).then(() => {
        res.redirect("/petition");
    });
});





///////////////////////////////////////////////////////////////////////////////
//                          PETITION/SIGNERS ROUTES                           //
///////////////////////////////////////////////////////////////////////////////
// ----------------------------------GET -------------------------------------//
app.get("/petition/signers", requireLoggedInUser, (req, res) => {
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
});
// ----------------------------------GET -------------------------------------//
app.get("/petition/signers/:city", requireLoggedInUser, (req, res) => {
    database.filterByCity(req.params.city)
        .then( result => {
            let allSigners = result.rows;
            res.render("signers", {
                layout: "main",
                allSigners
            });
        }).catch(err => {console.log("Err in filterByCity on req.param route: ", err);
        });
});
