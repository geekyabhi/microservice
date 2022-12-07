const ShoppingService = require("../services/shopping-service");
const Auth = require("../middlewares/auth");
const {
	PublishCustomerEvent,
	SubscribeMessage,
	PublishMessage,
} = require("../utils");
const { CUSTOMER_BINDING_KEY } = require("../config");

module.exports = (app, channel) => {
	const service = new ShoppingService();

	SubscribeMessage(channel, service);

	app.get("/orders", Auth, async (req, res, next) => {
		const { _id } = req.user;

		try {
			const { data } = await service.FindOrders({ customerId: _id });
			return res.status(200).json(data);
		} catch (err) {
			next(err);
		}
	});

	app.get("/cart", Auth, async (req, res, next) => {
		const { _id } = req.user;
		try {
			const { data } = await service.FindCart({ customerId: _id });
			return res.status(200).json(data);
		} catch (err) {
			next(err);
		}
	});
};
