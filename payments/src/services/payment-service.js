const { FormateData } = require("../utils/index");
const PaymentRepository = require("../database/repository/payment-repository");
const { APIError } = require("../utils/error/app-errors");

const { CreateOrder } = require("../utils/razorpay/index");

class PaymentService {
	constructor() {
		this.repository = new PaymentRepository();
	}

	async PurchaseStart({ customerId, items, amount }) {
		try {
			const order = await CreateOrder({
				amount: amount * 100,
				currency: "INR",
			});

			if (!order) throw new Error("Order cannot be created");
			const purchase = await this.repository.CreatePayment({
				razorpay_order_id: order.id,
				items: items,
				customerId,
			});

			return FormateData(purchase);
		} catch (e) {
			throw new APIError(e);
		}
	}

	async PurchaseComplete({
		razorpay_payment_id,
		razorpay_signature,
		razorpay_order_id,
	}) {
		try {
			const updatedPurchase =
				await this.repository.UpdatePaymentByOrderId({
					razorpay_order_id,
					completed: true,
					razorpay_payment_id,
					razorpay_signature,
				});
			return FormateData(updatedPurchase);
		} catch (e) {
			throw new APIError(e);
		}
	}

	async PurchaseVerfiy() {}

	async GetPaymentPayload(customerId, { razorpay_order_id }, event) {
		try {
			const payment = await this.repository.FindOnePayemnt({
				razorpay_order_id,
			});

			if (!payment)
				return FormateData({ error: "No product is available" });
			const payload = {
				event: event,
				customerId,
				payment,
			};
			return FormateData(payload);
		} catch (e) {
			throw new APIError(e);
		}
	}
}

module.exports = PaymentService;
