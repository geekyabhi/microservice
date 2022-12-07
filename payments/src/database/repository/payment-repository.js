const { APIError } = require("../../utils/error/app-errors");
const { PaymentModel } = require("../models");

class PaymentRepository {
	async CreatePayment({
		razorpay_order_id,
		customerId,
		completed,
		verified,
		razorpay_payment_id,
		razorpay_signature,
		items,
		amount,
	}) {
		let itemList = items || [];
		try {
			const payment = new PaymentModel({
				razorpay_order_id,
				customerId,
				completed,
				verified,
				razorpay_payment_id,
				razorpay_signature,
				items: itemList,
				amount,
			});
			const paymentResult = await payment.save();
			return paymentResult;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error on creating payment ${e}`
			);
		}
	}

	async UpdatePayment({
		razorpay_order_id,
		customerId,
		completed,
		verified,
		razorpay_payment_id,
		razorpay_signature,
		items,
		amount,
		_id,
	}) {
		try {
			const payment = await PaymentModel.findById(_id);

			payment.razorpay_order_id =
				razorpay_order_id || payment.razorpay_order_id;
			payment.customerId = customerId || payment.customerId;
			payment.completed = completed || payment.completed;
			payment.verified = verified || payment.verified;
			payment.razorpay_payment_id =
				razorpay_payment_id || payment.razorpay_payment_id;
			payment.razorpay_signature =
				razorpay_signature || payment.razorpay_signature;
			payment.items = items || payment.items;
			payment.amount = amount || payment.amount;

			const paymentResult = await payment.save();
			return paymentResult;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error on updating payment ${e}`
			);
		}
	}

	async UpdatePaymentByOrderId({
		razorpay_order_id,
		customerId,
		completed,
		verified,
		razorpay_payment_id,
		razorpay_signature,
		items,
		amount,
	}) {
		try {
			const payment = await PaymentModel.findOne({ razorpay_order_id });

			payment.customerId = customerId || payment.customerId;
			payment.completed = completed || payment.completed;
			payment.verified = verified || payment.verified;
			payment.razorpay_payment_id =
				razorpay_payment_id || payment.razorpay_payment_id;
			payment.razorpay_signature =
				razorpay_signature || payment.razorpay_signature;
			payment.items = items || payment.items;
			payment.amount = amount || payment.amount;

			const paymentResult = await payment.save();
			return paymentResult;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error on updating payment ${e}`
			);
		}
	}
}

module.exports = PaymentRepository;
