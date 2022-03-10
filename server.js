const express = require("express");
const http = require("http");
const app = express();
const databases = require("./v1/models");
const auth = require("./v1/controllers/auth.controllers")
require("dotenv").config();

// *@ Moment Js
moment = require("moment");
moment.locale("fr");

// *@ CORS
const cors = require("cors");
const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/public", express.static("public"));
app.use("/public/documents", express.static("public"));

Object.keys(databases).forEach((key) => {
  const db = databases[key];
  /* db.sequelize.sync({ alter: true }).then(() => {
    console.log("alter and re-sync db.");
  }); */
});

const _fRoutes = require("./functions/router.function");

//!------------- Routes

const Routes = _fRoutes.fromDir(`${__dirname}/v1/routes/auto`, ".js");

Routes.forEach((route) => {
  const call = require(route);
  app.use("/api/connect/v1", call);
});

app.get("/", async (req, res) => {
  res.send("Welcome to API Connect");
});

const server = http.createServer(app);

const PORT = process.env.PORT || 8081;
server.listen(PORT, () => {
  console.log("************* Le Serveur écoute sur le Port " + PORT);
});

module.exports = app;
