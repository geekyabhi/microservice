const CustomerService = require("../services/customer-service");
const { AppError } = require("../utils/error/app-errors");

module.exports = (app) => {
  const service = new CustomerService();

  app.post("/app-events", async (req, res, next) => {
    try {
      const { payload } = req.body;
      await service.SubscribeEvents(payload);
      console.log("Shopping Service received event");
      return res.status(200).json(payload);
    } catch (e) {
      next(e);
    }
  });
};
