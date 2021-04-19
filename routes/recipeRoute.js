const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { verifyAdmin, verifyUser } = require('../middleware/auth');
const { recipeImageUpload } = require('../middleware/imageUpload');
const Category = require('../models/categoryModel');
const Recipe = require('../models/recipeModel');

router.get("/recipes/fetch", (req, res, next) => {
    Recipe.find()
        .then(recipes => {
            Promise.all(recipes.map(recipe => recipe.populate("user").execPopulate()))
                .then(recipes => res.send({ success: true, recipes }))
                .catch(e => res.status(500).send({ success: false, message: e.message }));
        })
        .catch(e => res.status(500).send({ success: false, message: "Unable to get recipes" }));
});

router.get("/recipes/fetch/:categoryID", (req, res, next) => {
    Category.findById(req.params.categoryID)
        .then(category => {
            if (!category)
                return res.status(400).send({ success: false, message: "Category not found" });
            category.populate({
                path: "recipes",
                populate: {
                    path: "user"
                }
            }).execPopulate()
                .then(category => res.send({ success: true, recipes: category.recipes }))
                .catch(e => res.status(500).json({
                    message: "something went wrong. Unable to get recipes.",
                    success: false
                }));
        })
        .catch(e => res.status(500).json({
            message: "something went wrong. Unable to get recipes.",
            success: false
        }));
});

router.post("/recipe/insert", verifyAdmin, recipeImageUpload.single('image'), [
    check('name', "Recipe Name is required!").not().isEmpty(),
    check('description', "Recipe Description is required!").not().isEmpty(),
    check('category', "Category of recipe is required!").not().isEmpty().isMongoId()
], function (req, res) {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "image is required" });
    }
    req.body.image = req.file.path;
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        Recipe.create({ ...req.body, user: req.user.id })
            .then(recipe => {
                recipe.populate("category").execPopulate()
                    .then(recipe => {
                        const category = recipe.category;
                        category.recipes = [...category.recipes, recipe.id];
                        category.save()
                            .then(() => {
                                res.status(201).send({ success: true, recipe });
                            })
                            .catch(e => {
                                res.status(400).send({ success: false, message: "Unable to add recipe" });
                            });
                    })
                    .catch(e => {
                        console.log(e.message);
                        res.status(400).send({ success: false, message: "Unable to add recipe" });
                    });
            })
            .catch(e => {
                console.log(e.message);
                res.status(400).send({ success: false, message: "Unable to add recipe" });
            });
    } else {
        console.log(errors.array());
        let simplifiedErrors = {};
        errors.array().forEach(error => {
            simplifiedErrors[error.param] = error.msg;
        });
        res.status(400).json({ success: false, message: simplifiedErrors });
    }
});

router.get("/recipe/fetch/:recipeID", function (req, res) {
    Recipe.findById(req.params.recipeID)
        .then(function (recipe) {
            if (!recipe)
                return res.status(400).send({ success: false, message: "No recipe found" });
            recipe.populate("user").execPopulate()
                .then(function (recipe) {
                    res.send({ success: true, recipe });
                })
                .catch(error => {
                    res.status(500).send({ success: false, message: "Unable to get recipe" });
                });
        })
        .catch(error => {
            res.status(500).send({ success: false, message: "Unable to get recipe" });
        });
});


router.put("/recipe/update/:recipeID", verifyAdmin, recipeImageUpload.single('image'), function (req, res) {
    Recipe.findById(req.params.recipeID)
        .then(function (recipe) {
            if (!recipe)
                return res.status(400).send({ success: false, message: "No recipe found" });

            if (req.file)
                req.body.image = req.file.path;

            Object.keys(req.body).forEach(key => {
                recipe[key] = req.body[key];
            });

            recipe.save()
                .then(recipe => {
                    res.send({ success: true, recipe });
                })
                .catch(e => {
                    console.log(e.message);
                    res.status(500).send({ success: false, message: "Unable to update recipe" });
                });
        })
        .catch(error => {
            console.log(error.message);
            res.status(500).send({ success: false, message: "Unable to update recipe" });
        });
});

router.delete("/recipe/delete/:recipeID", verifyAdmin, (req, res, next) => {
    Recipe.findById(req.params.recipeID)
        .then(function (recipe) {
            recipe.populate("category").execPopulate()
                .then(recipe => {
                    if (!recipe)
                        return res.status(400).send({ success: false, message: "No recipe found" });
                    const category = recipe.category;
                    category.recipes = category.recipes.filter(recipeID => recipeID.toString() != recipe.id.toString());
                    category.save()
                        .then(() => {
                            recipe.remove()
                                .then(recipe => res.send({ success: true, recipe }))
                                .catch(e => res.status(500).json({ success: false, message: "Unable to delete recipe" }));
                        })
                        .catch(e => res.status(500).json({ success: false, message: "Unable to delete recipe" }));
                })
                .catch(e => res.status(500).json({ success: false, message: "Unable to delete recipe" }));
        })
        .catch(e => {
            res.status(500).json({ success: false, message: "Unable to delete recipe" });
        });
});

router.post("/recipe/mark/favourite/:recipeID", verifyUser, (req, res, next) => {
    Recipe.findById(req.params.recipeID)
        .then(function (recipe) {
            if (!recipe)
                return res.status(400).send({ success: false, message: "No recipe found" });
            const user = req.user;
            user.favourites = [...user.favourites, recipe.id];
            user.save()
                .then(() => res.send({ success: true, recipe }))
                .catch(e => {
                    res.status(500).json({ success: false, message: "Unable to mark recipe favourite" });
                });
        })
        .catch(e => {
            res.status(500).json({ success: false, message: "Unable to mark recipe favourite" });
        });
});

router.delete("/recipe/delete/favourite/:recipeID", verifyUser, (req, res, next) => {
    Recipe.findById(req.params.recipeID)
        .then(function (recipe) {
            if (!recipe)
                return res.status(400).send({ success: false, message: "No recipe found" });
            const user = req.user;
            user.favourites = user.favourites.filter(recipeID => recipeID.toString() != recipe.id.toString());
            user.save()
                .then(() => res.send({ success: true, recipe }))
                .catch(e => {
                    res.status(500).json({ success: false, message: "Unable to delete recipe from favourites" });
                });
        })
        .catch(e => {
            res.status(500).json({ success: false, message: "Unable to delete recipe from favourites" });
        });
});

module.exports = router;