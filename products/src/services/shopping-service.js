const { ShoppingRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/error/app-errors");

// All Business logic will be here
class ShoppingService {
	constructor() {
		this.repository = new ShoppingRepository();
	}

	async PlaceOrder(userInput) {
		const { _id, txnNumber } = userInput;

		// Verify the txn number with payment logs

		try {
			const orderResult = await this.repository.CreateNewOrder(
				_id,
				txnNumber
			);
			return FormateData(orderResult);
		} catch (e) {
			throw new APIError(e);
		}
	}

	async GetOrders(customerId) {
		try {
			const orders = await this.repository.Orders(customerId);
			return FormateData(orders);
		} catch (e) {
			throw new APIError(e);
		}
	}
}

module.exports = ShoppingService;
