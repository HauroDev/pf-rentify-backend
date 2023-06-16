const express = require("express");
const { PORT } = require("./config");
const { conn } = require("./src/db/db.js");
const morgan = require("morgan");
const routerManager = require("./src/routes/index.js");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// swagger
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerSpec = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Api-Rentify",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3001/api-rentify",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};
//
const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.name = "api-rentify";

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use((req, res, next) => {
  const allowedOrigins = ["http://localhost:5173"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

/*
  Agregen sus rutas
*/

app.use("/api-rentify", routerManager);

//swagger
app.use(
  "/api-doc",
  swaggerUI.serve,
  swaggerUI.setup(swaggerJsDoc(swaggerSpec))
);
console.log("http://localhost:3001/api-doc ---> documentacion");
//

conn
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, () => console.log(PORT));
  })
  .catch((error) => {
    console.error(error);
  });
