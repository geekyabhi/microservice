const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const amqplib = require("amqplib");

const {
	APP_SECRET,
	SHOPPING_BINDING_KEY,
	MESSAGE_QUEUE_URL,
	EXCHANGE_NAME,
	QUEUE_NAME,
} = require("../config");
const { AsyncAPIError } = require("./error/app-errors");

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

const PublishCustomerEvent = async (payload) => {
	try {
		const data = await axios.post(
			`http://localhost:8000/customer/app-events`,
			{
				payload,
			}
		);
	} catch (e) {
		console.log(`Error occured on publishing customer event ${e}`);
	}
};

const CreateChannel = async () => {
	try {
		const connection = await amqplib.connect(MESSAGE_QUEUE_URL);
		const channel = await connection.createChannel();
		await channel.assertExchange(EXCHANGE_NAME, "direct", false);
		return channel;
	} catch (e) {
		throw new Error(e);
	}
};

const PublishMessage = async (channel, binding_key, message) => {
	try {
		await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
		console.log(
			"Message has been published from shopping service",
			message
		);
	} catch (e) {
		throw new AsyncAPIError(e);
	}
};

const SubscribeMessage = async (channel, service) => {
	try {
		const appQueue = await channel.assertQueue("", { exclusive: true });
		channel.bindQueue(appQueue.queue, EXCHANGE_NAME, SHOPPING_BINDING_KEY);
		channel.consume(
			appQueue.queue,
			async (data) => {
				try {
					console.log("Message subscribed in shopping service");
					// console.log(JSON.parse(data.content.toString()));
					await service.SubscribeEvents(data.content.toString());
					// channel.ack(data);
				} catch (e) {
					console.log("Error occuring point");
					console.log(e);
					throw new AsyncAPIError(e);
				}
			},
			{ noAck: true }
		);
	} catch (e) {
		console.log("Error occurs");
		console.log(e);
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
	PublishCustomerEvent,
	CreateChannel,
	PublishMessage,
	SubscribeMessage,
};
