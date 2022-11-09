const { OrderModel, CartModel } = require("../models");
const { v4: uuidv4 } = require("uuid");
const {
  BadRequestError,
  APIError,
  STATUS_CODES,
} = require("../../utils/error/app-errors");

class ShoppingRepository {
  // payment

  async Orders(customerId) {
    try {
      const orders = await OrderModel.find({ customerId }).populate(
        "items.product"
      );
      return orders;
    } catch (e) {
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to Find Orders ${e}`
      );
    }
  }

  async Cart(customerId) {
    try {
      const cartItems = await CartModel.find({ customerId: customerId });
      if (!cartItems) throw new Error("Data not found");
      return cartItems;
    } catch (e) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to Find Cart ${e}`
      );
    }
  }

  async AddCartItem(customerId, item, qty, isRemove) {
    try {
      const cart = await CartModel.findOne({ customerId });
      const { _id } = item;

      if (cart) {
        let isExist = false;

        let cartItems = cart.items;

        if (cartItems.length > 0) {
          cartItems.map((item) => {
            if (item.product._id.toString() === _id.toString()) {
              if (isRemove) {
                cartItems.splice(cartItems.indexOf(item), 1);
              } else {
                item.unit = qty;
              }
              isExist = true;
            }
          });
        }

        if (!isExist && !isRemove) {
          cartItems.push({ product: { ...item }, unit: qty });
        }

        cart.items = cartItems;

        const cartSaveResult = await cart.save();

        return cartSaveResult;
      } else {
        return await CartModel.create({
          customerId,
          items: [{ product: { ...item }, unit: qty }],
        });
      }
    } catch (e) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Error on adding to cart ${e}`
      );
    }
  }

  async CreateNewOrder(customerId, txnId) {
    //check transaction for payment Status

    try {
      const cart = await CartModel.findOne({ customerId });

      if (cart) {
        let amount = 0;

        let cartItems = cart.items;

        if (cartItems.length > 0) {
          //process Order
          cartItems.map((item) => {
            amount += parseInt(item.product.price) * parseInt(item.unit);
          });

          const orderId = uuidv4();

          const order = new OrderModel({
            orderId,
            customerId,
            amount,
            txnId,
            status: "received",
            items: cartItems,
          });

          cart.items = [];

          const orderResult = await order.save();

          await cart.save();

          return orderResult;
        }
      } else {
        throw new BadRequestError("No item found in cart");
      }
    } catch (e) {
      throw APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to Find Category ${e}`
      );
    }
  }
}

module.exports = ShoppingRepository;
