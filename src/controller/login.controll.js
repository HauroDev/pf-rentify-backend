const { User } = require("../db/db");
const { Op } = require("sequelize");

const login = async (req, res) => {
  const { uid, email } = req.body;

  try {
    const user = await User.findOne({
      where: { [Op.and]: [{ uid }, { email }] },
    });

    if (!user) {
      throw new Error(402, "Email or Password not valid");
    }

    console.log(user.dataValues);
    res.status(200).json(user.dataValues);
  } catch (error) {
    console.error("Credential not validated:", error);
    res.status(401).json({ error: "Credential not validated" });
  }
};

module.exports = { login };
