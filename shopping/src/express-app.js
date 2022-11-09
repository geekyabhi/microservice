const express = require("express");
const cors = require("cors");
const { customer, products, shopping, appEvents } = require("./api");
const ErrorHandler = require("./utils/error/error-handler");
const morganMiddleware = require("./middlewares/morgan");

module.exports = async (app) => {
  app.use(morganMiddleware);
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cors());
  app.use(express.static(__dirname + "/public"));

  // customer(app);
  // products(app);
  appEvents(app);
  shopping(app);

  app.use("/status", (req, res, next) => {
    res.send("Shopping service running properly");
  });

  app.use(ErrorHandler);
};
