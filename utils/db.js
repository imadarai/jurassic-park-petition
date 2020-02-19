const spicedPg = require('spiced-pg');
// const secrets = require('./secrets');

///////////////////////////////////////////////////////////////////////////////
//                 DATABASE PORTS FOR LOCAL AND HEROKU                       //
///////////////////////////////////////////////////////////////////////////////

let db;
if (process.env.DATABSE_URL){
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const secrets = require ('./secrets');
    db = spicedPg(`postgres://${secrets.id}:${secrets.pass}@localhost:5432/petition`);
}

//const db = spicedPg(`postgres://${secrets.dbUser}:${secrets.dbPass}@`);
// const db = spicedPg(`postgres://${secrets.id}:${secrets.pass}@localhost:5432/petition`);

///////////////////////////////////////////////////////////////////////////////
//               DATABASE REQUEST FOR --- SIGNATURE TABLE                    //
///////////////////////////////////////////////////////////////////////////////
module.exports.addSig = function (signature, userId) {
    return db.query(
        'INSERT INTO petition (signature, user_id) VALUES ($1, $2) RETURNING id',
        [signature, userId],
    );
};
module.exports.getSig = function(userIdFromCookie) {
    return db.query(
        `SELECT signature FROM petition WHERE user_id = $1 `,
        [userIdFromCookie]
    );
};
///////////////////////////////////////////////////////////////////////////////
//                  DATABASE REQUEST FOR --- USERS TABLE                     //
///////////////////////////////////////////////////////////////////////////////
module.exports.createUser = function (first, last, email, hashedPassword) {
    return db.query(
        'INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id',
        [first, last, email, hashedPassword],
    );
};
module.exports.selectAllSigners = function() {
    return db.query(
        `SELECT users.first, users.last, profile.age, profile.city, profile.url
        FROM users
        LEFT JOIN profile
        ON users.id = profile.user_id
        JOIN petition
        ON users.id = petition.user_id`
    );
};
module.exports.getPassword = function(emailFromLoginPage) {
    return db.query(
        `SELECT id, first, last, password FROM users WHERE email = $1`,
        [emailFromLoginPage]
    );
};
///////////////////////////////////////////////////////////////////////////////
//               DATABASE REQUEST FOR --- PROFILE TABLE                      //
///////////////////////////////////////////////////////////////////////////////
module.exports.addProfile = function (age, city, homepage, userId) {
    return db.query(
        'INSERT INTO profile (age, city, url, user_id) VALUES ($1, $2, $3, $4)',
        [age, city, homepage, userId],
    );
};
