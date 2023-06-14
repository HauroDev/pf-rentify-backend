const { Product, Category } = require('../db/db.js');



const getCategories = async (req, res) =>{
    try {
        console.log(Category);
        const categories = await Category.findAll({
            include: {
                model: Product,
                attributes: ["idProd","name"]

            }
        });

        
        
        res.status(200).json(categories)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getCategories
}