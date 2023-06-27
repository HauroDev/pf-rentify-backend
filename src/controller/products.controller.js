const { Product, Category, User, Comment, Country } = require("../db/db");
const { Op } = require("sequelize");
const { obtenerNextPageProduct } = require("../utils/paginado.js");
const { CustomError } = require("../utils/customErrors.js");

const getProducts = async (req, res) => {
  // agregar price entre un rango a futuro
  let {
    name,
    offset,
    limit,
    orderBy,
    orderType,
    idCategory,
    idCountry,
    location,
    state,
  } = req.query;

  const whereOptions = {};

  if (name) {
    whereOptions.name = {
      [Op.iLike]: `%${name}%`,
    };
  }

  if (idCountry) {
    whereOptions.idCountry = +idCountry;
    if (state) {
      whereOptions.state = {
        [Op.iLike]: `%${state}%`,
      };

      if (location) {
        whereOptions.location = {
          [Op.iLike]: `%${location}%`,
        };
      }
    }
  }

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
    const result = await Product.findAndCountAll({
      where: whereOptions,
      include: [
        {
          model: Category,
          through: { attributes: [] },
          as: "categories",
          where: idCategory ? { idCategory: +idCategory } : {},
        },
        {
          model: Country,
          as: "country",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
      ],
      distinct: true,
      offset: offset || 0,
      limit: limit || 12,
      order: orderOptions,
    });

    const { rows: products, count } = result;

    offset = offset || offset > 0 ? +offset : 0;
    limit = limit ? +limit : 12;

    let queryExtend = obtenerNextPageProduct(offset, limit, count);
    if (queryExtend) {
      const params = [];

      if (name) {
        params.push(`name=${name}`);
      }

      if (orderBy) {
        params.push(`orderBy=${orderBy}`);
      }

      if (orderType) {
        params.push(`orderType=${orderType}`);
      }

      if (idCategory) {
        params.push(`idCategory=${idCategory}`);
      }

      if (idCountry) {
        params.push(`idCountry=${idCountry}`);
        if (state) {
          params.push(`state=${state}`);
          if (location) {
            params.push(`location=${location}`);
          }
        }
      }

      queryExtend += params.length > 0 ? `&${params.join("&")}` : "";
    }

    res.status(200).json({
      count,
      next: queryExtend,
      results: products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// faltan hacer verificaciones para que no cree productos si no se cumplen ciertas reglas
const createProduct = async (req, res) => {
  const { idUser, idCountry, ...product } = req.body;

  try {
    const categoriesDb = await Category.findAll({
      where: { name: product.categories?.map((cat) => cat.name) },
    });
    // Validaciones
    if (!categoriesDb.length) {
      throw new CustomError(
        404,
        "The request could not be completed, Categories not found"
      );
    }

    if (!idUser) {
      throw new CustomError(
        404,
        "The request could not be completed, idUser is required to create a product."
      );
    }

    const user = await User.findByPk(idUser);

    if (!user) {
      throw new CustomError(
        404,
        "The request could not be completed, User is not found."
      );
    }

    const country = await Country.findByPk(idCountry);

    if (!country) {
      throw new CustomError(
        404,
        "The request could not be completed, Country not found."
      );
    }

    // fin de Validaciones

    const productDb = await Product.create(product);
    await productDb.addUser(user);
    await productDb.addCategories(categoriesDb);
    console.log(country);
    await productDb.setCountry(country);

    let categoriesSearch = await productDb.getCategories();
    const countrySearch = (await productDb.getCountry()).toJSON();

    console.log(countrySearch);

    categoriesSearch = categoriesSearch.map((cat) => {
      cat = cat.toJSON();

      delete cat.createdAt;
      delete cat.updatedAt;
      delete cat.CategoryProduct;

      return cat;
    });

    delete countrySearch.createdAt;
    delete countrySearch.updatedAt;

    res.status(200).json({
      ...productDb.toJSON(),
      categories: categoriesSearch,
      country: countrySearch,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      throw new CustomError(
        404,
        "The request could not be completed, You need an ID to obtain a product."
      );
    }
    const product = await Product.findByPk(id, {
      include: [
        { model: Category, as: "categories", through: { attributes: [] } },
        {
          model: Country,
          as: "country",
          attributes: { exclude: ["createdAt", "updatedAt"] },
        },
        { model: Comment, as: "comments" },
      ],
    });

    if (!product) {
      throw new CustomError(
        404,
        `The request could not be completed, Product id:${id} is not found`
      );
    }

    const userCreator = await product.getUsers({
      order: [["createdAt", "DESC"]],
      limit: 1,
    });

    // no me dejo de otra sequelize que mutar los objetos del array
    userCreator[0] = userCreator[0].toJSON();

    delete userCreator[0]?.UserProduct;

    res.status(200).json({ ...product.toJSON(), users: userCreator });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProducts = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    console.log(user);
    if (!user) {
      throw new Error(404, "User not valid");
    }

    //const products = await user.getProducts();
    // const categories = ...completar
    const products = await user.getProducts({
      include: [{ model: Category, as: "categories" }],
      through: { attributes: [] },
    });
    res.status(200).json(products);
  } catch (error) {
    // Manejar errores de consulta
    console.error("Error al obtener los productos del usuario:", error);
    throw error;
  }
};
//PRUEBA GONZALO<------
// Controlador para actualizar el statusProd de un producto
const updateProductstatusPub = async (req, res) => {
  const { idProd, statusPub } = req.body; // Suponiendo que recibes el ID del producto como parámetro en la URL
  console.log(idProd);
  try {
    // Buscar el producto por su ID
    const product = await Product.findByPk(idProd);
    console.log(product);
    if (!product) {
      return res.status(404).json({ error: "Product not found ??" });
    }

    // Actualizar el statusProd del producto
    product.statusPub = statusPub;
    await product.save();

    return res
      .status(200)
      .json({ message: "Product status updated successfully" });
  } catch (error) {
    console.error("Error updating product status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getProducts,
  createProduct,
  getProductById,
  getUserProducts,
  updateProductstatusPub,
};
