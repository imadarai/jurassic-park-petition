const supertest = require('supertest');
const { app } = require('./index.js');
const cookieSession = require('cookie-session');


test("POST /welcome sets req.session.submitted to true", () => {
    const cookie = {};
    cookieSession.mockSessionOnce(cookie);

    return supertest(app).post('/welcome')
        .then( response => {
            expect(cookie.submitted).toBe(true);
        });
});

test("Get /home send 200 status code when there is a submitted cookie", () => {
    cookieSession.mockSessionOnce({
        submitted: true
    });
    return supertest(app).get('/home')
        .then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.text).toBe("<h1>home</h1>");
        });
});

test("Get /home send 302 status code as response when no cookie", () => {
    return supertest(app).get('/home')
        .then( response => {
            expect(response.statusCode).toBe(302);
            expect(response.headers.location).toBe("/welcome");
        });

});


test("GET /home send 200 status code as response", () => {
    return supertest(app).get('/welcome')
        .then( response => {
            expect(response.statusCode).toBe(200);
            expect(response.text).toBe("<h1>hwelllwooowowowowo</h1>");
        });
});

///////////////////////////////////////////////////////////////////////////////
//                                 GET - ROUTES                              //
///////////////////////////////////////////////////////////////////////////////
// ----------------------SUPER TEST DUMMY ROUTES ----------------------------//
// app.get("/welcome", (req, res) => {
//     res.send("<h1>hwelllwooowowowowo</h1>");
// });
//
// app.post("/welcome", (req, res) => {
//     res.session.submitted = true;
//     res.redirect('/home');
// });
//
// app.get("/home", (req, res) => {
//     if (!req.session.submitted) {
//         return res.redirect('/welcome');
//     }
//     res.send("<h1>home</h1>");
// });
