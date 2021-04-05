require('./mongooseSetup.js');
const Request = require('./expressSetup.js');
const testImage = `${__dirname}/test_image.png`;
const fs = require('fs');

describe("Testing groceryRouter", () => {
    let adminToken;
    let categoryID;
    let recipeID;
    beforeAll((done) => {
        const adminUser = {
            fullName: "Sunil Prasai",
            userName: "sunpra1",
            email: "sunpra12@gmail.com",
            role: "ADMIN",
            password: "sunpra12"
        };
        Request.post("/register")
            .send(adminUser)
            .then(registeradminUserRes => {
                adminToken = "Bearer " + registeradminUserRes.body.token;
                const newCategory = { name: "Another Category" };
                Request.post("/category/insert")
                    .set("authorization", adminToken)
                    .send(newCategory)
                    .then(newCategoryRes => {
                        categoryID = newCategoryRes.body.category._id;
                        done();
                    });
            });
    });

    test("Should insert recipe", () => {
        const recipe = {
            name: "Recipe name",
            description: "Recipe description",
            category: categoryID
        };
        return Request.post("/recipe/insert")
            .set("authorization", adminToken)
            .set("contentType", 'application/octet-stream')
            .attach("image", testImage)
            .field("name", recipe.name)
            .field("description", recipe.description)
            .field("category", recipe.category)
            .then(res => {
                recipeID = res.body.recipe._id;
                expect(res.statusCode).toBe(201);
                expect(res.body.recipe.name).toBe(recipe.name);
                expect(res.body.recipe.description).toBe(recipe.description);
                expect(res.body.recipe.category._id).toBe(recipe.category);
                expect(res.body.recipe.image).not.toBe(undefined);
            });
    });

    test("Should get all recipes", () => {
        return Request.get("/recipes/fetch")
            .then(res => {
                expect(res.statusCode).toBe(200);
                expect(res.body.recipes.length > 0).toBe(true);
            });
    });

    test("Should update recipe", () => {
        const recipe = {
            name: "Recipe name updated",
            description: "Recipe description updated"
        };
        return Request.put("/recipe/update/" + recipeID)
            .set("authorization", adminToken)
            .send(recipe)
            .then(res => {
                expect(res.statusCode).toBe(200);
                expect(res.body.recipe.name).toBe(recipe.name);
                expect(res.body.recipe.description).toBe(recipe.description);
            });
    });

    test("Should delete recipe", () => {
        return Request.delete("/recipe/delete/" + recipeID)
            .set("authorization", adminToken)
            .then(res => {
                console.log(res.body);
                expect(res.statusCode).toBe(200);
                expect(res.body.recipe).not.toBe(undefined);
            });
    });
});