const express = require("express");
const cors = require("cors");
const ErrorHandler = require("./utils/error/error-handler");
const morganMiddleware = require("./middlewares/morgan");
const { payment } = require("./api");

module.exports = async (app, channel) => {
	app.use(morganMiddleware);
	app.use(express.json({ limit: "1mb" }));
	app.use(express.urlencoded({ extended: true, limit: "1mb" }));
	app.use(cors());
	app.use(express.static(__dirname + "/public"));

	app.use("/status", (req, res, next) => {
		res.send("Payments service running properly");
	});

	payment(app, channel);

	app.use(ErrorHandler);
};
