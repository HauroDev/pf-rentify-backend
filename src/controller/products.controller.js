const { Product, Category, User, Comment } = require("../db/db.js");
const { Op } = require("sequelize");
const { obtenerNextPageProduct } = require("../utils/paginado.js");
const { createError } = require("../utils/customErrors");

const getProducts = async (req, res) => {
  // agregar price entre un rango a futuro
  let { name, offset, limit, orderBy, orderType, idCategory } = req.query;

  const whereOptions = name
    ? {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      }
    : {};

  const orderOptions = [["isFeatured", "DESC"]];

  orderType = orderType || "ASC";

  switch (orderBy) {
    case "price":
      orderOptions.push(["price", orderType]);
      break;
    case "name":
      orderOptions.push(["name", orderType]);
      break;
    case "date":
    default:
      orderOptions.push(["updatedAt", orderType]);
  }

  try {
    const count = await Product.count({ where: whereOptions });

    const products = await Product.findAll({
      where: whereOptions,
      include: [
        {
          model: Category,
          through: { attributes: [] },
          as: "categories", // si o si tiene que tener esto si la relacion en db.js tiene un "as" aun no se por que. att:victor
          where: idCategory ? { idCategory: +idCategory } : {},
        },
      ],
      offset: offset || 0,
      limit: limit || 12,
      order: orderOptions,
    });

    offset = offset || offset > 0 ? +offset : 0;
    limit = limit ? +limit : 12;

    res.status(200).json({
      count,
      next: obtenerNextPageProduct(offset, limit, count),
      results: products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// faltan hacer verificaciones para que no cree productos si no se cumplen ciertas reglas
const createProduct = async (req, res) => {
  const { idUser, ...product } = req.body;

  try {
    const categoriesDb = await Category.findAll({
      where: { name: product.categories?.map((cat) => cat.name) },
    });
    // Validaciones
    if (!categoriesDb.length) {
      throw createError(
        404,
        "The request could not be completed, Categories not found"
      );
      // categoriesDb = await Category.bulkCreate(product?.categories)
    }

    if (!idUser)
      throw createError(
        404,
        "The request could not be completed, idUser is required to create a product."
      );

    const user = await User.findByPk(idUser);

    if (!user)
      throw createError(
        404,
        "The request could not be completed, User is not found."
      );

    // fin de Validaciones

    const productDb = await Product.create(product);
    await productDb.addUser(user);

    await productDb.addCategories(categoriesDb);

    let categoriesSeach = await productDb.getCategories();

    categoriesSeach = categoriesSeach.map(({ idCategory, name }) => ({
      idCategory,
      name,
    }));

    res.status(200).json({
      ...productDb.toJSON(),
      categories: categoriesSeach,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id)
      throw createError(
        404,
        "The request could not be completed, You need an ID to obtain a product."
      );

    const product = await Product.findByPk(id, {
      include: [
        { model: Category, as: "categories", through: { attributes: [] } },
        { model: Comment, as: "comments" },
      ],
    });

    if (!product) {
      throw createError(
        404,
        `The request could not be completed, Product id:${id} is not found`
      );
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  createProduct,
  getProductById,
};
