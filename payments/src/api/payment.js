const Auth = require("../middlewares/auth");
const PaymentService = require("../services/payment-service");

module.exports = (app, channel) => {
	const paymentService = new PaymentService();

	app.post("/start", Auth, async (req, res, next) => {
		try {
			const customerId = req.user._id;
			const { amount, items } = req.body;

			const data = await paymentService.PurchaseStart({
				customerId,
				items,
				amount,
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

			//Publish in Customer Service
			//Publish Updates in Shopping Service
			// Publish Updates in Products Service

			return res.json({ success: true, data });
		} catch (e) {
			next(e);
		}
	});
};
