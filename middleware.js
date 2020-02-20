function requireLoggedOutUser (req, res, next){
    if (req.session.userId){
        res.redirect('/petition');
    } else {
        next();
    }
    //I can pass this function to /register get/post and /login get/post
}
function requireNoSignature (req, res, next){
    if (req.session.userId){
        res.redirect('/petition');
    } else {
        next();
    }
    //I can pass this function to /register get/post and /login get/post
}
function requireSignature (req, res, next){
    if (req.session.userId){
        res.redirect('/petition');
    } else {
        next();
    }
    //I can pass this function to /register get/post and /login get/post
}

exports.requireSignature = requireSignature;
exports.requireNoSignature = requireNoSignature;
exports.requireLoggedOutUser = requireLoggedOutUser;
