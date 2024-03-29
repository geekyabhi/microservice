const express = require("express");
const { PORT } = require("./config");
const ConnectDB = require("./database/connection");
const expressApp = require("./express-app");
const { CreateChannel } = require("./utils");
const { ConnectRedis } = require("./utils/cache");

const StartServer = async () => {
	try {
		const app = express();
		await ConnectDB();

		const channel = await CreateChannel();
		const redisClient = await ConnectRedis();

		await expressApp(app, channel, redisClient);

		app.listen(PORT, () => {
			console.log(`Customer server running to port ${PORT}`.yellow);
			console.log(`http://localhost:${PORT}`.yellow.underline);
		}).on("error", (err) => {
			throw new Error(err);
		});
	} catch (e) {
		console.log(e);
		process.exit(0);
	}
};

StartServer();
