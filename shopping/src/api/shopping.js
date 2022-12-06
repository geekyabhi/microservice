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

	app.post("/order", Auth, async (req, res, next) => {
		const { _id } = req.user;
		const { txnNumber } = req.body;

		try {
			const { data } = await service.PlaceOrder({ _id, txnNumber });

			const payload = await service.GetProductPayload(
				_id,
				data,
				"CREATE_ORDER"
			);

			PublishMessage(
				channel,
				CUSTOMER_BINDING_KEY,
				JSON.stringify(payload)
			);

			return res.status(200).json(data);
		} catch (err) {
			next(err);
		}
	});

	app.get("/orders", Auth, async (req, res, next) => {
		const { _id } = req.user;

		try {
			const { data } = await service.GetOrders(_id);
			return res.status(200).json(data);
		} catch (err) {
			next(err);
		}
	});

	app.get("/cart", Auth, async (req, res, next) => {
		const { _id } = req.user;
		try {
			const { data } = await service.getCart({ _id });
			return res.status(200).json(data);
		} catch (err) {
			next(err);
		}
	});
};
