const express = require("express");
const { PORT } = require("./config");
const ConnectDB = require("./database/connection");
const expressApp = require("./express-app");

const StartServer = async () => {
	try {
		const app = express();
		await ConnectDB();

		await expressApp(app);

		app.listen(PORT, () => {
			console.log(`Products server running to port ${PORT}`.yellow);
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
