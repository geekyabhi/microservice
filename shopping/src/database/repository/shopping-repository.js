const { OrderModel, CartModel } = require("../models");
const {
	BadRequestError,
	APIError,
	STATUS_CODES,
} = require("../../utils/error/app-errors");

class ShoppingRepository {
	async CreateOrder({ orderId, customerId, amount, status, txnId, items }) {
		try {
			const itemList = items || [];

			const order = new OrderModel({
				orderId,
				customerId,
				amount,
				status,
				txnId,
				items: itemList,
			});
			const orderResult = await order.save();
			return orderResult;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Unable to Create Order ${e}`
			);
		}
	}

	async UpdateOrderByOrderId({
		orderId,
		customerId,
		amount,
		status,
		txnId,
		items,
	}) {
		try {
			const order = await OrderModel.findOne({ orderId });
			if (!order) throw new Error("No such order exists");
			order.customerId = customerId || order.customerId;
			order.amount = amount || order.amount;
			order.status = status || order.status;
			order.txnId = txnId || order.txnId;
			order.items = items || order.items;
			await order.save();
			return order;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Unable to Update Order ${e}`
			);
		}
	}

	async AddToCart({ customerId, item, unit }) {
		try {
			const cart = await CartModel.findOne({ customerId });
			if (!cart) {
				const items = [];
				items.push({
					_id: item._id,
					name: item.name,
					banner: item.banner,
					desc: item.desc,
					type: item.type,
					unit: unit,
					supplier: item.supplier || item.suplier,
					price: item.price,
				});
				const cartData = new CartModel({
					customerId,
					items,
				});
				const cartDataResult = await cartData.save();
				return cartDataResult;
			} else {
				const items = cart.items || [];
				const existingIndex = items.findIndex(
					(i) => i._id.toString() === item._id.toString()
				);
				if (existingIndex >= 0) {
					items[existingIndex].unit = unit;
				} else {
					items.push({
						_id: item._id,
						name: item.name,
						banner: item.banner,
						desc: item.desc,
						type: item.type,
						unit: unit,
						supplier: item.supplier || item.suplier,
						price: item.price,
					});
				}
				cart.items = items;
				const cartData = await cart.save();
				return cartData;
			}
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Unable to Add to Cart ${e}`
			);
		}
	}

	async RemoveFromCart({ customerId, itemId }) {
		try {
			const cart = await CartModel.findOne({ customerId });
			if (!cart) return {};
			cart.items = cart.items.filter(
				(i) => i._id.toString() !== itemId.toString()
			);
			const cartData = await cart.save();
			return cartData;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Unable to Remove from Cart ${e}`
			);
		}
	}

	async GetOrders({ customerId }) {
		try {
			const orders = await OrderModel.find({ customerId });
			return orders;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Unable to Get Orders ${e}`
			);
		}
	}

	async GetCart({ customerId }) {
		try {
			const cart = await CartModel.findOne({ customerId });
			if (!cart) return {};
			return cart;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Unable to Get Cart ${e}`
			);
		}
	}

	async EmptyCart({ customerId }) {
		try {
			const cart = await CartModel.findOne({ customerId });
			if (cart) await CartModel.deleteOne({ customerId });
			return cart;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Unable to Clear Cart ${e}`
			);
		}
	}
}

module.exports = ShoppingRepository;
