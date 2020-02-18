const spicedPg = require('spiced-pg');
const secrets = require('./secrets');

//const db = spicedPg(`postgres://${secrets.dbUser}:${secrets.dbPass}@`);
const db = spicedPg(`postgres://${secrets.id}:${secrets.pass}@localhost:5432/petition`);


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

module.exports.selectAll = function() {
    return db.query(
        `SELECT * FROM users`
    );
};

module.exports.createUser = function (first, last, email, hashedPassword) {
    return db.query(
        'INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id',
        [first, last, email, hashedPassword],
    );
};

module.exports.getPassword = function(emailFromLoginPage) {
    return db.query(
        `SELECT id, first, last, password FROM users WHERE email = $1`,
        [emailFromLoginPage]
    );
};
