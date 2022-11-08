const { CustomerModel, AddressModel } = require("../models");
const {
	BadRequestError,
	APIError,
	STATUS_CODES,
} = require("../../utils/error/app-errors");

class CustomerRepository {
	async CreateCustomer({ email, password, phone, salt, name }) {
		try {
			const customer = new CustomerModel({
				email,
				password,
				name,
				salt,
				phone,
				address: [],
			});
			const customerResult = await customer.save();
			return customerResult;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error on creating customer ${e}`
			);
		}
	}

	async CreateAddress({ _id, street, postalCode, city, country }) {
		try {
			const profile = await CustomerModel.findById(_id);

			if (profile) {
				const newAddress = new AddressModel({
					street,
					postalCode,
					city,
					country,
				});

				await newAddress.save();

				profile.address.push(newAddress);
			}

			return await profile.save();
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error on creating address ${e}`
			);
		}
	}

	async FindCustomer({ email }) {
		try {
			const existingCustomer = await CustomerModel.findOne({
				email: email,
			});
			return existingCustomer;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error on finding customer ${e}`
			);
		}
	}

	async UpdateCustomer({ _id, updates }) {
		try {
			const user = await CustomerModel.findById(_id);
			user.name = updates?.name || user.name;
			user.email = updates?.email || user.email;
			user.phone = updates?.phone || user.phone;
			user.password = updates?.password || user.password;
			const data = await user.save();
			return data;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error on updating customer ${e}`
			);
		}
	}

	async FindCustomerById({ id }) {
		try {
			const existingCustomer = await CustomerModel.findById(id)
				.populate("address")
				.populate("wishlist")
				.populate("orders")
				.populate("cart.product");
			return existingCustomer;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error on finding customer ${e}`
			);
		}
	}

	async Wishlist(customerId) {
		try {
			const profile = await CustomerModel.findById(customerId).populate(
				"wishlist"
			);

			return profile.wishlist;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error to get wishlist ${e}`
			);
		}
	}

	async AddWishlistItem(customerId, product) {
		try {
			const profile = await CustomerModel.findById(customerId).populate(
				"wishlist"
			);

			if (profile) {
				let wishlist = profile.wishlist;

				if (wishlist.length > 0) {
					let isExist = false;
					wishlist.map((item) => {
						if (item._id.toString() === product._id.toString()) {
							const index = wishlist.indexOf(item);
							wishlist.splice(index, 1);
							isExist = true;
						}
					});

					if (!isExist) {
						wishlist.push(product);
					}
				} else {
					wishlist.push(product);
				}

				profile.wishlist = wishlist;
			}

			const profileResult = await profile.save();

			return profileResult.wishlist;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error to add to wishlist ${e}`
			);
		}
	}

	async AddCartItem(customerId, product, qty, isRemove) {
		try {
			const profile = await CustomerModel.findById(customerId).populate(
				"cart.product"
			);

			if (profile) {
				const cartItem = {
					product,
					unit: qty,
				};

				let cartItems = profile.cart;

				if (cartItems.length > 0) {
					let isExist = false;
					cartItems.map((item) => {
						if (
							item.product._id.toString() ===
							product._id.toString()
						) {
							if (isRemove) {
								cartItems.splice(cartItems.indexOf(item), 1);
							} else {
								item.unit = qty;
							}
							isExist = true;
						}
					});

					if (!isExist) {
						cartItems.push(cartItem);
					}
				} else {
					cartItems.push(cartItem);
				}

				profile.cart = cartItems;

				const cartSaveResult = await profile.save();

				return cartSaveResult.cart;
			}

			throw new Error("Unable to add to cart!");
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error on adding to cart ${e}`
			);
		}
	}

	async AddOrderToProfile(customerId, order) {
		try {
			const profile = await CustomerModel.findById(customerId);

			if (profile) {
				if (profile.orders == undefined) {
					profile.orders = [];
				}
				profile.orders.push(order);

				profile.cart = [];

				const profileResult = await profile.save();

				return profileResult;
			}

			throw new Error("Unable to add to order!");
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Error on adding order in profile ${e}`
			);
		}
	}
}

module.exports = CustomerRepository;
