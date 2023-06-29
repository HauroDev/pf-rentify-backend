const CustomError = require("../utils/customErrors");
const {
  getBlackList,
  saveTokenInBlackList,
} = require("../services/blacklist.service");

const logout = async (req, res) => {
  const blacklistSet = await getBlackList();
  const blacklist = new Set(blacklistSet);
  try {
    let auth_token = req.headers?.authorization;

    if (!auth_token) {
      throw new CustomError(400, "Send the the authorization header");
    }

    auth_token = auth_token.split(" ")[1]; // nos quedamos unicamente con el token y no con el Bearer

    blacklist.add(auth_token);
    await saveTokenInBlackList(blacklist);

    res.clearCookie("auth_token");
    res.status(200).json({
      access: false,
      user: null,
      auth_token: null,
      error: null,
    });
  } catch (error) {
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

module.exports = { logout };
