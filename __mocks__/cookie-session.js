let tempSession, session = {};

module.exports = () => (req, res, next) => {
    req.session = tempSession || session;
    tempSession = null;
    next();
};

//mockseesion will allow us to write data to a cookie in our test,
//and data written to the cookie will exist across multiple tests
module.exports.mockSession = sess => session = sess;

//mockSessionOnce will alow us to write data to a cookie in our test,
//but tahat cookie will only exit for one test
module.exports.mockSessionOnce = sess => tempSession = sess;
