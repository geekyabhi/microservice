const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const amqplib = require("amqplib");
const { AsyncAPIError } = require("../utils/error/app-errors");
const {
	APP_SECRET,
	EXCHANGE_NAME,
	MESSAGE_QUEUE_URL,
	QUEUE_NAME,
	PRODUCT_BINDING_KEY,
} = require("../config");

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const GenerateSalt = async () => {
	try {
		return await bcrypt.genSalt();
	} catch (e) {
		throw new Error(`Unable to create Salt ${e}`);
	}
};

const GeneratePassword = async (password, salt) => {
	try {
		return await bcrypt.hash(password, salt);
	} catch (e) {
		throw new Error(`Unable to create Password ${e}`);
	}
};

const ValidatePassword = async (enteredPassword, savedPassword, salt) => {
	try {
		return await bcrypt.compare(enteredPassword, savedPassword);
	} catch (e) {
		throw new Error(`Unable to match password ${e}`);
	}
};

const GenerateSignature = async (payload) => {
	try {
		return await jwt.sign(payload, APP_SECRET, { expiresIn: "1d" });
	} catch (e) {
		throw new Error(`Unable to generate signature ${e}`);
	}
};

const ValidateSignature = async (signature) => {
	try {
		if (!signature || !signature.includes(" ")) {
			throw new Error("Invalid authorization header format");
		}
		const token = signature.split(" ")[1];
		const payload = await jwt.verify(token, APP_SECRET);
		return payload;
	} catch (e) {
		throw new Error(`Not Authorized ${e}`);
	}
};

const FormateData = (data) => {
	if (data) {
		return { data };
	} else {
		throw new Error(`Data Not found!`);
	}
};

const CreateChannel = async (retries = 8, delay = 4000) => {
	for (let attempt = 1; attempt <= retries; attempt++) {
		try {
			const connection = await amqplib.connect(MESSAGE_QUEUE_URL);
			const channel = await connection.createChannel();
			await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
			console.log(`Broker connected on ${MESSAGE_QUEUE_URL}`.green);

			connection.on("error", (err) => {
				console.error("RabbitMQ connection error:", err.message);
			});
			connection.on("close", () => {
				console.warn("RabbitMQ connection closed. Restarting...");
				process.exit(1);
			});

			return channel;
		} catch (e) {
			if (attempt < retries) {
				console.log(`[RabbitMQ] attempt ${attempt}/${retries} failed — retrying in ${delay}ms...`);
				await sleep(delay);
			} else {
				throw new Error(`Could not connect to RabbitMQ after ${retries} attempts: ${e}`);
			}
		}
	}
};

const PublishMessage = async (channel, binding_key, message) => {
	try {
		await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
		console.log("Message published from product service", message);
	} catch (e) {
		throw new AsyncAPIError(e);
	}
};

const SubscribeMessage = async (channel, service) => {
	try {
		const appQueue = await channel.assertQueue("", { exclusive: true });
		channel.bindQueue(appQueue.queue, EXCHANGE_NAME, PRODUCT_BINDING_KEY);
		channel.consume(
			appQueue.queue,
			async (data) => {
				try {
					console.log("Message subscribed in product service");
					await service.SubscribeEvents(data.content.toString());
				} catch (e) {
					console.error("Error processing product message:", e);
				}
			},
			{ noAck: true }
		);
	} catch (e) {
		throw new AsyncAPIError(e);
	}
};

module.exports = {
	GenerateSalt,
	GeneratePassword,
	ValidatePassword,
	GenerateSignature,
	ValidateSignature,
	FormateData,
	CreateChannel,
	PublishMessage,
	SubscribeMessage,
};
