const jwt = require("jsonwebtoken");
const { errorsToken } = require("../utils/errorToken");
const { JWT_SECRET } = process.env;
const CustomError = require("./customErrors");
const {
  getBlackList,
  saveTokenInBlackList,
} = require("../services/blacklist.service");

const verifyAuthToken = async (req, res, next) => {
  let auth_token = req.headers?.authorization;
  const blacklistSet = await getBlackList();
  const blacklist = new Set(blacklistSet);

  try {
    // obtenemos el token de la cookie

    if (!auth_token) throw new CustomError(400, "No token");

    auth_token = auth_token.split(" ")[1]; // nos quedamos unicamente con el token y no con el Bearer

    if (blacklist.has(auth_token)) {
      throw new CustomError(401, "invalid token");
    }

    const decode = jwt.verify(auth_token, JWT_SECRET);

    // verificamos si el token expiró
    if (decode.exp < Date.now() / 1000) {
      throw new CustomError(401, "jwt expired");
    }

    // Almecenamos los dattos del usuario en el objeto req
    req.userId = decode.userId;
    req.userEmail = decode.userEmail;
    //req.userName = decode.userName;

    next();
  } catch (error) {
    const status = error.status || 500;

    if (error.message === "jwt expired") {
      blacklist.add(auth_token);
      await saveTokenInBlackList(blacklist);
    }

    if (
      errorsToken(error.message) !==
      "An unexpected error occurred in token validation"
    ) {
      return res.status(400).json({ error: errorsToken(error.message) });
    }
    res.status(status).json({ error: error.message });
  }
};

module.exports = verifyAuthToken;
