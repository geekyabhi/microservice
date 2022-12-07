const { ShoppingRepository } = require("../database");
const { FormateData } = require("../utils");
const {
	APIError,
	AsyncAPIError,
	STATUS_CODES,
} = require("../utils/error/app-errors");

class ShoppingService {
	constructor() {
		this.repository = new ShoppingRepository();
	}
	async CreateOrder({ orderId, customerId, amount, status, txnId, items }) {
		try {
			const order = await this.repository.CreateOrder({
				orderId,
				customerId,
				amount,
				status,
				txnId,
				items,
			});
			return FormateData(order);
		} catch (e) {
			throw new APIError(e);
		}
	}

	async AddItemToCart({ customerId, item, unit }) {
		try {
			const cart = await this.repository.AddToCart({
				customerId,
				item,
				unit,
			});
			return FormateData(cart);
		} catch (e) {
			throw new APIError(e);
		}
	}

	async FindOrders({ customerId }) {
		try {
			const orders = await this.repository.GetOrders({ customerId });
			return FormateData(orders);
		} catch (e) {
			throw new APIError(e);
		}
	}

	async FindCart({ customerId }) {
		try {
			const carts = await this.repository.GetCart({ customerId });
			return FormateData(carts);
		} catch (e) {
			throw new APIError(e);
		}
	}

	async ClearCart({ customerId }) {
		try {
			await this.repository.EmptyCart({ customerId });
		} catch (e) {
			throw new APIError(e);
		}
	}

	async SubscribeEvents(payload) {
		payload = JSON.parse(payload);
		try {
			const { event, data, customerId } = payload;
			let {
				razorpay_order_id,
				razorpay_payment_id,
				amount,
				completed,
				items,
				item,
				unit,
			} = data;

			switch (event) {
				case "CLEAR_CART":
					await this.ClearCart({ customerId });
					break;
				case "ADD_TO_ORDERS":
					await this.CreateOrder({
						orderId: razorpay_order_id,
						customerId,
						amount,
						status: completed ? "Completed" : null,
						txnId: razorpay_payment_id,
						items,
					});
					break;
				case "ADD_TO_CART":
					await this.AddItemToCart({ customerId, item, unit });
					break;
				default:
					break;
			}
		} catch (e) {
			throw new AsyncAPIError(e);
		}
	}
}

module.exports = ShoppingService;
