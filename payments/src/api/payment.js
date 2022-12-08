const {
	CUSTOMER_BINDING_KEY,
	SHOPPING_BINDING_KEY,
	PRODUCT_BINDING_KEY,
} = require("../config");
const Auth = require("../middlewares/auth");
const PaymentService = require("../services/payment-service");
const { PublishMessage } = require("../utils");

module.exports = (app, channel) => {
	const paymentService = new PaymentService();

	app.get("/", Auth, async (req, res, next) => {
		try {
			const query = req.query;
			const customerId = req.user._id;
			query.customerId = customerId;

			const data = await paymentService.GetAllPayment(query);

			return res.json({ success: true, data });
		} catch (e) {
			next(e);
		}
	});

	app.get("/one", Auth, async (req, res, next) => {
		try {
			const query = req.query;
			const customerId = req.user._id;
			query.customerId = customerId;

			const data = await paymentService.GetOnePayment(query);

			return res.json({ success: true, data });
		} catch (e) {
			next(e);
		}
	});

	app.post("/start", Auth, async (req, res, next) => {
		try {
			const customerId = req.user._id;
			const { items } = req.body;

			const data = await paymentService.PurchaseStart({
				customerId,
				items,
			});

			return res.json({ success: true, data });
		} catch (e) {
			next(e);
		}
	});

	app.post("/complete", Auth, async (req, res, next) => {
		try {
			const customerId = req.user._id;

			const {
				razorpay_payment_id,
				razorpay_signature,
				razorpay_order_id,
			} = req.body;

			const data = await paymentService.PurchaseComplete({
				razorpay_payment_id,
				razorpay_signature,
				razorpay_order_id,
			});

			const payload = await paymentService.GetPaymentPayload(
				customerId,
				{ razorpay_order_id },
				"TEMP_PAYLOAD"
			);

			const orderPayload = {
				event: "ADD_TO_ORDERS",
				customerId,
				data: {
					razorpay_order_id:
						payload?.data?.payment?.razorpay_order_id,
					razorpay_payment_id:
						payload?.data?.payment?.razorpay_payment_id,
					amount: payload?.data?.payment?.amount,
					completed: payload?.data?.payment?.completed,
					items: payload?.data?.payment?.items,
				},
			};

			const customerPayload = {
				event: "CREATE_ORDER",
				data: {
					userId: customerId,
					order: {
						_id: payload?.data?.payment?.razorpay_order_id,
						amount: payload?.data?.payment?.amount,
					},
				},
			};

			const cartPayload = {
				event: "CLEAR_CART",
				customerId,
				data: {},
			};

			console.log(cartPayload);

			console.log(orderPayload);

			PublishMessage(
				channel,
				SHOPPING_BINDING_KEY,
				JSON.stringify(orderPayload)
			);

			PublishMessage(
				channel,
				SHOPPING_BINDING_KEY,
				JSON.stringify(cartPayload)
			);

			PublishMessage(
				channel,
				CUSTOMER_BINDING_KEY,
				JSON.stringify(customerPayload)
			);

			return res.json({ success: true, data });
		} catch (e) {
			next(e);
		}
	});
};
