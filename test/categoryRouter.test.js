require('./mongooseSetup.js');
const Request = require('./expressSetup.js');

describe("Testing routes on category router", () => {
    let adminToken;
    let categoryID;
    beforeAll((done) => {
        const adminUser ={
            fullName: "Asha Sharma",
            userName: "asha123", //provide different username then provided on user router test
            email: "asha123@gmail.com",
            role: "ADMIN",
            password: "asha123"
        };
        Request.post("/register")
            .send(adminUser)
            .then(registeradminUserRes => {
                adminToken = "Bearer " + registeradminUserRes.body.token;
                done();
            });
    });


    test("Should fail to add empty category", () => {
        const expectedMessage = "Category name is required!";
        return Request.post("/category/insert")
            .set("authorization", adminToken)
            .send({ name: "" })
            .then(newCategoryRes => {
                expect(newCategoryRes.statusCode).toBe(400);
                expect(newCategoryRes.body.message.name).toBe(expectedMessage);
            });
    });

    test("Should add new category", () => {
        const newCategory = { name: " Category Unique" };
        return Request.post("/category/insert")
            .set("authorization", adminToken)
            .send(newCategory)
            .then(newCategoryRes => {
                categoryID = newCategoryRes.body.category._id;
                expect(newCategoryRes.statusCode).toBe(201);
                expect(newCategoryRes.body.category.name).toBe(newCategory.name);
            });
    });

    test("Should get all categories", () => {
        return Request.get("/categories/fetch")
            .then(getAllCatRes => {
                expect(getAllCatRes.statusCode).toBe(200);
                expect(getAllCatRes.body.categories.length > 0).toBe(true);
            });
    });

    test("Should not find category with id that doesn't exist while updating", () => {
        const idThatDoesntExist = "5f2cfd905a6bda2740a2c234";
        const updatedCategory = { name: "Category Updated" };
        const expectedMessage = "Category not found";
        return Request.put("/category/update/" + idThatDoesntExist)
            .send(updatedCategory)
            .set("authorization", adminToken)
            .then(updateCategoryRes => {
                expect(updateCategoryRes.statusCode).toBe(400);
                expect(updateCategoryRes.body.message).toBe(expectedMessage);
            });
    });




    test("Shoud update category", () => {
        const updatedCategory = { name: " Category is Updated" };
        return Request.put("/category/update/" + categoryID)
            .set("authorization", adminToken)
            .send(updatedCategory)
            .then(updateCategoryRes => {
                expect(updateCategoryRes.statusCode).toBe(200);
                expect(updateCategoryRes.body.category._id).toBe(categoryID);
                expect(updateCategoryRes.body.category.name).toBe(updatedCategory.name);
            });
    });

    test("Should not find category with id that doesn't exist while deleting", () => {
        const idThatDoesntExist = "5f2cfd905a6bda2740a2c234";
        const expectedMessage = "Category not found";
        return Request.delete("/category/delete/" + idThatDoesntExist)
            .set("authorization", adminToken)
            .then(deleteCatRes => {
                expect(deleteCatRes.statusCode).toBe(400);
                expect(deleteCatRes.body.message).toBe(expectedMessage);
            });
    });

    test("Shoud delete category with " + categoryID, () => {
        return Request.delete("/category/delete/" + categoryID)
            .set("authorization", adminToken)
            .then(deleteCatRes => {
                expect(deleteCatRes.statusCode).toBe(200);
                expect(deleteCatRes.body.category._id).toBe(categoryID);
            });
    });
});