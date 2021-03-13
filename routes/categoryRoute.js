const express = require('express');
const router = express.Router();
const recipe = require('../models/categoryModel');
const { check, validationResult, body } = require('express-validator');
const Category = require('../models/categoryModel');
const { verifyAdmin } = require('../middleware/auth');

router.get("/categories/fetch", (req, res, next) => {
    Category.find()
        .then(categories => res.send({ success: true, categories }))
        .catch(e => res.status(500).send({ success: false, message: "Unable to get categories" }));
});

router.post('/category/insert', verifyAdmin, [
    check('name', "Category name is required!").not().isEmpty(),
], function (req, res) {
    console.log(req.body);
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        Category.create({ name: req.body.name })
            .then(category => res.status(201).send({ success: true, category }))
            .catch(e => {
                res.status(500).send({ success: false, message: "Unable to add new category" });
            });
    } else {
        let simplifiedErrors = {};
        errors.array().forEach(error => {
            simplifiedErrors[error.param] = error.msg;
        });
        res.status(400).json({ success: false, message: simplifiedErrors });
    }
});

router.get("/category/fetch/:categoryID", (req, res, next) => {
    Category.findById(req.params.categoryID)
        .then(category => {
            if (!category)
                return res.status(400).send({ success: false, message: "Category not found" });
            res.send({ success: true, category });
        })
        .catch(e => res.status(500).json({
            message: "something went wrong. Cannot  update category",
            success: false
        }));
});





router.put("/category/update/:categoryID", verifyAdmin, [
    check('name', "Updated category name is required!").not().isEmpty(),
], (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        Category.findById(req.params.categoryID)
            .then(category => {
                if (!category)
                    return res.status(400).send({ success: false, message: "Category not found" });
                category.name = req.body.name;
                category.save()
                    .then(category => res.send({ success: true, category }))
                    .catch(e => res.status(500).json({
                        message: "something went wrong. Unable to update category.",
                        success: false
                    }));
            })
            .catch(e => res.status(500).json({
                message: "something went wrong. Unable to update category",
                success: false
            }));
    } else {
        let simplifiedErrors = {};
        errors.array().forEach(error => {
            simplifiedErrors[error.param] = error.msg;
        });
        res.status(400).json({ success: false, message: simplifiedErrors });
    }
});

router.delete("/category/delete/:categoryID", verifyAdmin, (req, res, next) => {
    Category.findById(req.params.categoryID)
        .then(category => {
            if (!category)
                return res.status(400).send({ success: false, message: "Category not found" });

            if (category.recipes.length > 0)
                return res.status(400).send({ success: false, message: "This category includes more then one recepies. Deletion is prohibited." });

            category.remove()
                .then(category => res.send({ success: true, category }))
                .catch(e => res.status(500).json({
                    message: "something went wrong. Unable to delete category.",
                    success: false
                }));
        })
        .catch(e => res.status(500).json({
            message: "something went wrong. Unable to delete category",
            success: false
        }));
});

module.exports = router;

