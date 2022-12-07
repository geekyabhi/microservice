const { FormateData } = require("../../../customer/src/utils");
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
			// const plan = await this.planService.FindPlanById({ planId });
			// await this.planRepository.AddCustomerToPlan({
			// 	planId,
			// 	customerId,
			// });
			// const updatedCustomer = await this.customerRepository.AddPlantoCustomer(
			// 	{
			// 		planId,
			// 		started: currDate,
			// 		activeTill: new Date(moment(currDate).add(plan.period, "M")),
			// 		customerId,
			// 	}
			// );
			return FormateData(updatedPurchase);
		} catch (e) {
			throw new APIError(e);
		}
	}

	async PurchaseVerfiy() {}
}

module.exports = PaymentService;
