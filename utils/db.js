const spicedPg = require('spiced-pg');
const secrets = require('./secrets');

//const db = spicedPg(`postgres://${secrets.dbUser}:${secrets.dbPass}@`);
const db = spicedPg(`postgres://${secrets.id}:${secrets.pass}@localhost:5432/petition`);


module.exports.addSig = function (first, last, signature) {
    return db.query(
        'INSERT INTO petition (first, last, signature) VALUES ($1, $2, $3) RETURNING id',
        [first, last, signature],
    );
};

exports.selectAll = function() {
    return db.query(
        `SELECT * FROM petition`
    );
};

exports.getSig = function(userIdFromCookie) {
    return db.query(
        `SELECT signature FROM petition WHERE id = $1 `,
        [userIdFromCookie]
    );
};

// module.exports.totalCount = function() {
//     return db.query(
//         `SELECT COUNT(*) AS "count" FROM petition`
//     );
// };
