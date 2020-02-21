const {app} = require('../index');
const {requireLoggedInUser} = require('../utils/middleware.js');
const database = require('../utils/db.js');

// -----------------------------/DELETE ROUTE -------------------------------//
app.get("/delete", requireLoggedInUser, (req, res) => {
    database.deleteSignature(req.session.userId)
        .then(database.deleteProfile(req.session.userId)
            .then(database.deleteUser(req.session.userId))
            .catch(err => console.log("Err in deleting profile: ", err))
        );
    res.redirect("/logout");
});
