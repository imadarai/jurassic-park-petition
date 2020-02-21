const {app} = require('../index');
const {requireLoggedInUser} = require('../utils/middleware.js');
const database = require('../utils/db.js');
const {hash} = require("../utils/bc.js");



///////////////////////////////////////////////////////////////////////////////
//                              PROFILE ROUTES                               //
///////////////////////////////////////////////////////////////////////////////
// -----------------------------------GET------------------------------------//
app.get("/profile", requireLoggedInUser, (req, res) => {
    res.render("profile", {
        layout: "main",
    });
});
// ----------------------------------POST------------------------------------//
app.post("/profile", requireLoggedInUser, (req, res) => {
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




///////////////////////////////////////////////////////////////////////////////
//                            PROFILE/EDIT ROUTES                            //
///////////////////////////////////////////////////////////////////////////////
// -----------------------------------GET------------------------------------//
app.get("/profile/edit", requireLoggedInUser, (req, res) => {
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

// ----------------------------------POST------------------------------------//
app.post("/profile/edit", requireLoggedInUser, (req, res) => {
    let {first, last, email, password, age, city, url} = req.body;
    let profileInfo = {first, last, email, password, age, city, url};
    if (!password) {
        if (url){
            if(!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("//")){
                return res.render("editprofile", {
                    layout: "main",
                    url: true,
                    profileInfo
                });
            }
        }
        database.updateUserTableNoPassword(first, last, email, req.session.userId)
            .then ( () => {
                database.updateProfileTable(age, city, url, req.session.userId);
            }).then( () => {
                res.render("editprofile", {
                    layout: "main",
                    //passing data
                    successfullyUpdated: true,
                    profileInfo
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
        if (url){
            if(!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("//")){
                return res.render("editprofile", {
                    layout: "main",
                    url: true,
                    profileInfo
                });
            }
        }
        hash(password).then(hashedPassword => {
            database.updateUserTable(first, last, email, hashedPassword, req.session.userId)
                .then ( () => {
                    database.updateProfileTable(age, city, url, req.session.userId);
                }).then( () => {
                    res.render("editprofile", {
                        layout: "main",
                        //passing data
                        successfullyUpdated: true,
                        profileInfo
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
