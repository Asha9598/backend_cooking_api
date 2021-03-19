const Request = require('supertest');
const Express = require('express');
const UserRouter = require('../routes/userRoute');
const RecipeRouter = require('../routes/recipeRoute');
const CategoryRouter = require('../routes/categoryRoute');

const app = Express();
app.use(Express.json());
app.use(Express.urlencoded({ extended: false }));
app.use(UserRouter);
app.use(RecipeRouter);
app.use(CategoryRouter);

app.use("*", function (req, res, next) {
    let err = new Error("Route Not Found");
    err.statusCode = 404;
    next(err);
});

module.exports = Request(app);