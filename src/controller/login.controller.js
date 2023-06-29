const { User } = require("../db/db");
const { Op } = require("sequelize");
const { generateToken } = require("../utils/generateToken");
const login = async (req, res) => {
  const { uid, email } = req.body;

  try {
    const user = await User.findOne({
      where: { [Op.and]: [{ uid }, { email }] },
    });

    if (!user) {
      throw new Error(402, "Email or Password not valid");
    }
    const { email, uid, role } = user.dataValues;

    const { token, expireIn } = generateToken(uid, email, role, res);

    console.log(user.dataValues);
    // res.status(200).json(user.dataValues)
    console.log(token);
    return res.status(200).json({
      access: true,
      user: { email, uid, role },
      auth_token: {
        token,
        expireIn,
      },
      error: null,
    });
  } catch (error) {
    console.error("Credential not validated:", error);
    res.status(401).json({ error: "Credential not validated" });
  }
};

module.exports = { login };
