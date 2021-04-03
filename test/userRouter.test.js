require('./mongooseSetup.js');
const Request = require('./expressSetup.js');

describe("Testing routes on user router", () => {
    test("Should fail registration as password is not provided", () => {
        const newUser = {
            fullName: "Sunil Prasai",
            userName: "sunpra",
            email: "sunpra12@gmail.com"
        };
        const expectedMessage = "password is required!";
        return Request.post("/register")
            .send(newUser)
            .then(registerNewUserRes => {
                expect(registerNewUserRes.statusCode).toBe(400);
                expect(registerNewUserRes.body.message.password).toBe(expectedMessage);
            });
    });

    test("Should register new user", () => {
        const newUser = {
            fullName: "Sunil Prasai",
            userName: "sunpra",
            email: "sunpra12@gmail.com",
            password: "sunpra12"
        };
        return Request.post("/register")
            .send(newUser)
            .then(registerNewUserRes => {
                adminToken = registerNewUserRes.body.token;

                expect(registerNewUserRes.statusCode).toBe(201);
                expect(registerNewUserRes.body.user.userName).toBe(newUser.userName);
                expect(registerNewUserRes.body.user.email).toBe(newUser.email);
                expect(registerNewUserRes.body.token === undefined).not.toBe(true);
            });

    });

    test("Should not get when invalid password is provided", async () => {
        const user = {
            userName: "sunpra",
            password: "sunpra1"
        };
        const expectedMessage = "Incorrect password";
        return Request.post("/login")
            .send(user)
            .then(registerNewUserRes => {
                expect(registerNewUserRes.statusCode).toBe(400);
                expect(registerNewUserRes.body.message).toBe(expectedMessage);
            });
    });


    test("Should login registered user", async () => {
        const user = {
            userName: "sunpra",
            password: "sunpra12"
        };
        return Request.post("/login")
            .send(user)
            .then(registerNewUserRes => {
                expect(registerNewUserRes.statusCode).toBe(200);
                expect(registerNewUserRes.body.user.userName).toBe(user.userName);
                expect(registerNewUserRes.body.token === undefined).not.toBe(true);
            });
    });
});