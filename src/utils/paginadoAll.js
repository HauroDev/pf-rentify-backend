const { MODE, URL_PRUEBAS, URL_DEPLOY } = require("../../config.js");

const obtenerNextPageProductAll = (
  rutaBase,
  posicionPorPagina,
  limitePorPagina,
  limiteCantidad
) => {
  const offset = posicionPorPagina + limitePorPagina;
  const limit = limitePorPagina;

  return offset < limiteCantidad
    ? `${
        MODE === "PRODUCTION" ? URL_DEPLOY : URL_PRUEBAS
      }/api-rentify/${rutaBase}/all/?offset=${offset}&limit=${limit}`
    : null;
};

module.exports = { obtenerNextPageProductAll };
