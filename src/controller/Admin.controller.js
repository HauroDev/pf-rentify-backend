const User = require('../models/User');
const Product = require('../models/Product');

// Cambiar estado de un usuario por ID
async function changeUserStatusById(req, res) {
  const { userId, newStatus } = req.params;

  try {
    // Buscar el usuario por su ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Actualizar el estado del usuario
    user.status = newStatus;
    await user.save();

    return res.json({ message: 'Estado de usuario actualizado correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al cambiar el estado del usuario' });
  }
}

// Cambiar estado de un producto por ID
async function changeProductStatusById(req, res) {
  const { productId, newStatus } = req.params;

  try {
    // Buscar el producto por su ID
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Actualizar el estado del producto
    product.status = newStatus;
    await product.save();

    return res.json({ message: 'Estado del producto actualizado correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al cambiar el estado del producto' });
  }
}

module.exports = {
  changeUserStatusById,
  changeProductStatusById,
};