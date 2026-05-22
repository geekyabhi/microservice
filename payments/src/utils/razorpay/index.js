const Razorpay = require("razorpay");
const { RAZORPAY_API_KEY, RAZORPAY_API_SECRET } = require("../../config");
const { APIError } = require("../error/app-errors");
const crypto = require("crypto");

let rzInstance = null;

const getRzInstance = () => {
	if (!rzInstance) {
		if (!RAZORPAY_API_KEY || !RAZORPAY_API_SECRET) {
			throw new Error(
				"Razorpay credentials are not set. Add RAZORPAY_API_KEY and RAZORPAY_API_SECRET to your environment."
			);
		}
		rzInstance = new Razorpay({
			key_id: RAZORPAY_API_KEY,
			key_secret: RAZORPAY_API_SECRET,
		});
	}
	return rzInstance;
};

const CreateOrder = async ({ amount, currency }) => {
	try {
		const order = await getRzInstance().orders.create({ amount, currency });
		return order;
	} catch (e) {
		throw new APIError(e);
	}
};

const Verify = async (
	razorpay_order_id,
	razorpay_payment_id,
	razorpay_signature
) => {
	try {
		const body = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSignature = crypto
			.createHmac("sha256", RAZORPAY_API_SECRET)
			.update(body.toString())
			.digest("hex");
		return expectedSignature === razorpay_signature;
	} catch (e) {
		throw new APIError(e);
	}
};

module.exports = { CreateOrder, Verify };
