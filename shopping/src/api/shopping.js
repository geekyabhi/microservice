const ShoppingService = require("../services/shopping-service");
const Auth = require("../middlewares/auth");
const { PublishCustomerEvent } = require("../utils");

module.exports = (app) => {
  const service = new ShoppingService();

  app.post("/order", Auth, async (req, res, next) => {
    const { _id } = req.user;
    const { txnNumber } = req.body;

    try {
      const { data } = await service.PlaceOrder({ _id, txnNumber });

      const payload = await service.GetProductPayload(
        _id,
        data,
        "CREATE_ORDER"
      );

      PublishCustomerEvent(payload);

      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/orders", Auth, async (req, res, next) => {
    const { _id } = req.user;

    try {
      const { data } = await service.GetOrders(_id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/cart", Auth, async (req, res, next) => {
    const { _id } = req.user;
    try {
      const { data } = await service.getCart({ _id });
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });
};
