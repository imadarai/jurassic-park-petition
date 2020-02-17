const spicedPg = require('spiced-pg');
const secrets = require('./secrets');

//const db = spicedPg(`postgres://${secrets.dbUser}:${secrets.dbPass}@`);
const db = spicedPg(`postgres://${secrets.id}:${secrets.pass}@localhost:5432/petition`);


module.exports.addSig = function (first, last, signature) {
    return db.query(
        'INSERT INTO petition (first, last, petition) VALUES ($1, $2, $3)',
        [first, last, signature]
    );
};
