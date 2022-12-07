const dotEnv = require("dotenv").config({ path: "./.env" });

// if (process.env.NODE_ENV !== "prod") {
//   const configFile = `./.env.${process.env.NODE_ENV}`;
//   // dotEnv.config({ path: configFile });
// } else {
//   dotEnv.config();
// }

module.exports = {
	PORT: process.env.PORT,
	DB_URL: process.env.MONGODB_URI,
	APP_SECRET: process.env.APP_SECRET,
	EXCHANGE_NAME: "ECOMMERCE",
	MESSAGE_QUEUE_URL: process.env.RABBIT_MQ_URL,
	SHOPPING_BINDING_KEY: "SHOPPING_SERVICE",
	CUSTOMER_BINDING_KEY: "CUSTOMER_SERVICE",
	PAYMENT_BINDING_KEY: "PAYMENT_SERVICE",
	PRODUCT_BINDING_KEY: "PRODUCT_SERVICE",
	QUEUE_NAME: "ECOMMERCE_QUEUE",
};
