function requireLoggedOutUser (req, res, next){
    if (req.session.userId){
        res.redirect('/petition');
    } else {
        next();
    }
    //I can pass this function to /register get/post and /login get/post
}
function requireLoggedInUser (req, res, next){
    if (!req.session.userId){
        res.redirect('/registration');
    } else {
        next();
    }
    //I can pass this function to /register get/post and /login get/post
}

exports.requireLoggedInUser = requireLoggedInUser;
exports.requireLoggedOutUser = requireLoggedOutUser;
