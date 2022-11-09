const Auth = require("../middlewares/auth");
const CustomerService = require("../services/customer-service");

module.exports = (app) => {
  const service = new CustomerService();

  app.post("/signup", async (req, res, next) => {
    try {
      const { email, password, phone, name } = req.body;
      const { data } = await service.SignUp({
        email,
        password,
        phone,
        name,
      });
      return res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });

  app.post("/login", async (req, res, next) => {
    try {
      const { phone, password } = req.body;

      const { data } = await service.SignIn({ phone, password });

      return res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });

  app.post("/address", Auth, async (req, res, next) => {
    try {
      const { _id } = req.user;

      const { street, postalCode, city, country } = req.body;

      const { data } = await service.AddNewAddress(_id, {
        street,
        postalCode,
        city,
        country,
      });
      return res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });

  app.get("/profile", Auth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetProfile({ _id });
      return res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });

  app.put("/profile", Auth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { email, password, phone, name } = req.body;

      const { data } = await service.UpdateProfile({
        _id,
        email,
        password,
        phone,
        name,
      });
      return res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });

  app.get("/shoping-details", Auth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetShopingDetails(_id);
      return res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });

  app.get("/wishlist", Auth, async (req, res, next) => {
    try {
      const { _id } = req.user;
      const { data } = await service.GetWishList(_id);
      return res.json({ success: true, data });
    } catch (e) {
      next(e);
    }
  });
};
