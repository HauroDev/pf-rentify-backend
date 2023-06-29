const { Blacklist } = require("../db/db");

const getBlackList = async (token) => {
  const tokens = await Blacklist.findAll();
  const blacklist = new Set(tokens.map((t) => t.token));
  return blacklist;
};

const saveTokenInBlackList = async (blacklist) => {
  const tokens = [...blacklist].map((token) => ({ token }));
  await Blacklist.bulkCreate(tokens, {
    updateOnDuplicate: ["updatedAt"],
  });
};

module.exports = { getBlackList, saveTokenInBlackList };
