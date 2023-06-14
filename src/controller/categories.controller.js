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


const createCategories = async (req, res) => {
    try {
        const {name} = req.body;
        console.log(name)
        const allowedCategories = [
        'electronics',
        'fashion and accessories',
        'home and decoration',
        'sports and fitness / health and wellness',
        'books and entertainment',
        'cars and motorcycles',
        'toys and kids',
        'personal care',
        'arts and crafts'
        ]

        if(!allowedCategories.includes(name)) throw Error(`invalid category: ${name}`)

        const allCategories = await Category.findAll({
            attributes: ["name"]
        });

        if (allCategories.find(category => category.name === name)) {
            throw new Error(`Category ${name} already exists`);
        }

        const categoryCreated = await Category.create({name});

        
        res.status(201).json(categoryCreated)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = {
    getCategories,
    createCategories,
}