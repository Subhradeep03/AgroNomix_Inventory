const Category = require('../models/category_model');

exports.addCategory = async (req, res) => {
    try {
        const { name, store_id } = req.body;
        const newCategory = await Category.create({
            name: name,
            store_id: store_id,
        });

        return res.status(200).send({
            success: true,
            message: "Successfully created the Category",
            newCategory
        });
    } catch (error) {
        throw error;
    }
};
