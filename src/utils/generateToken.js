const jwt = require("jsonwebtoken");
const { JWT_SECRET, MODE } = process.env;

const generateToken = (userId, userEmail, role, res) => {
  try {
    const expiresIn = 60 * 60 * 24 * 7; // 7 dias
    const token = jwt.sign({ userId, userEmail, role }, JWT_SECRET, {
      expiresIn: expiresIn,
    });

    res.cookie("auth_token", token, {
      httpOnly: true, // La cookie solo puede ser leída por el servidor
      secure: !(MODE === "development"), // solo es seguro cuando esta en produccion
      expires: new Date(Date.now() + expiresIn * 1000),
    });

    return { token, expiresIn };
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

module.exports = { generateToken };
