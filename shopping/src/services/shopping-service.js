const { ShoppingRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError, AsyncAPIError } = require("../utils/error/app-errors");

// All Business logic will be here
class ShoppingService {
  constructor() {
    this.repository = new ShoppingRepository();
  }

  async getCart({ _id }) {
    try {
      const cartItems = await this.repository.Cart(_id);
      return FormateData(cartItems);
    } catch (e) {
      throw new APIError(e);
    }
  }

  async PlaceOrder(userInput) {
    const { _id, txnNumber } = userInput;

    // Verify the txn number with payment logs

    try {
      const orderResult = await this.repository.CreateNewOrder(_id, txnNumber);
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

  async ManageCart(customerId, item, qty, isRemove) {
    try {
      const cartResult = await this.repository.AddCartItem(
        customerId,
        item,
        qty,
        isRemove
      );
      return FormateData(cartResult);
    } catch (e) {
      throw new APIError(e);
    }
  }

  async SubscribeEvents(payload) {
    payload = JSON.parse(payload);
    try {
      const { event, data } = payload;

      const { userId, product, order, qty } = data;

      switch (event) {
        case "ADD_TO_CART":
          await this.ManageCart(userId, product, qty, false);
          break;
        case "REMOVE_FROM_CART":
          await this.ManageCart(userId, product, qty, true);
          break;
        default:
          break;
      }
    } catch (e) {
      throw new AsyncAPIError(e);
    }
  }

  async GetProductPayload(userId, order, event) {
    try {
      if (order) {
        const payload = {
          event: event,
          data: { userId, product, qty },
        };
        return FormateData(payload);
      } else {
        return FormateData({ error: "No order is available" });
      }
    } catch (e) {
      throw new APIError(e);
    }
  }
}

module.exports = ShoppingService;
