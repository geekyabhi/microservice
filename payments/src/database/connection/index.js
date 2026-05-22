const mongoose = require("mongoose");
require("colors");
const { DB_URL } = require("../../config");

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const ConnectDB = async (retries = 8, delay = 3000) => {
	for (let attempt = 1; attempt <= retries; attempt++) {
		try {
			const { connection } = await mongoose.connect(encodeURI(DB_URL), {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			});
			console.log(
				`Database connected on port ${connection.port} on host ${connection.host}`.cyan
			);
			return;
		} catch (e) {
			if (attempt < retries) {
				console.log(`[MongoDB] attempt ${attempt}/${retries} failed — retrying in ${delay}ms...`);
				await sleep(delay);
			} else {
				throw new Error(`Could not connect to MongoDB after ${retries} attempts: ${e}`);
			}
		}
	}
};

module.exports = ConnectDB;
