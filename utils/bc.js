const bcrypt = require('bcryptjs');

let { genSalt, hash, compare } = bcrypt;
const {promisify} = require ('util');

genSalt = promisify(genSalt);
hash = promisify(hash);
compare = promisify(compare);

module.exports.compare = compare;
module.exports.hash = plainText => genSalt().then(salt =>(hash(plainText, salt)));





//DEMO for how BCRYPT Functions work
// genSalt().then ( salt => {
//     console.log("Salt Createb by BCrypt: ", salt);//generate salt to add for more PW security
//     return hash ("safePassword", salt);
// }).then(hashedPw => {
//     console.log("hashedPswd: ", hashedPw);
//     return compare("safePassword", hashedPw);
// }).then( matchedValueCompare => {
//     console.log("Password provided is: ", matchedValueCompare);
// });
