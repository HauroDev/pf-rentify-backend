const { Product, Category } = require('../db/db.js');



const getCategories = async (req, res) =>{
    try {
        console.log(Category);
        const categories = await Category.findAll({
            include: {
                model: Product
            }
        });

        
        
        res.status(200).json(categories)
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {
    getCategories
}