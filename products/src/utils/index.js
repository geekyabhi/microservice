const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const amqplib = require("amqplib");
// const axios = require("axios");
const { AsyncAPIError } = require("../utils/error/app-errors");
const {
  APP_SECRET,
  EXCHANGE_NAME,
  MESSAGE_QUEUE_URL,
  QUEUE_NAME,
  PRODUCT_BINDING_KEY,
} = require("../config");

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

// const PublishCustomerEvent = async (payload) => {
//   try {
//     const data = await axios.post(`http://localhost:8000/customer/app-events`, {
//       payload,
//     });
//   } catch (e) {
//     console.log(`Error occured on publishing customer event ${e}`);
//   }
// };

// const PublishShoppingEvent = async (payload) => {
//   try {
//     const data = await axios.post(`http://localhost:8000/shopping/app-events`, {
//       payload,
//     });
//   } catch (e) {
//     console.log(`Error occured on publishing shopping event ${e}`);
//   }
// };

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
    console.log("Message has been published from product service", message);
  } catch (e) {
    throw new AsyncAPIError(e);
  }
};

const SubscribeMessage = async (channel, service) => {
  try {
    const appQueue = await channel.assertQueue(QUEUE_NAME);
    channel.bindQueue(appQueue.queue, EXCHANGE_NAME, PRODUCT_BINDING_KEY);
    channel.consume(appQueue.queue, (data) => {
      try {
        console.log("Message subscribed in product service");
        channel.ack(data);
      } catch (e) {
        throw new AsyncAPIError(e);
      }
    });
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
  // PublishCustomerEvent,
  // PublishShoppingEvent,
  CreateChannel,
  PublishMessage,
  SubscribeMessage,
};
