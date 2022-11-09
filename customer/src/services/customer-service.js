const { AsyncAPIError } = require("../../src/utils/error/app-errors");
const { CustomerRepository } = require("../database");
const {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} = require("../utils");
const {
  APIError,
  BadRequestError,
  AppError,
} = require("../utils/error/app-errors");

class CustomerService {
  constructor() {
    this.repository = new CustomerRepository();
  }

  async SignIn(userInputs) {
    const { phone, password } = userInputs;

    try {
      const existingCustomer = await this.repository.FindCustomer({
        phone,
      });

      console.log(existingCustomer);
      console.log(password);

      if (existingCustomer) {
        const validPassword = await ValidatePassword(
          password,
          existingCustomer.password,
          existingCustomer.salt
        );

        if (validPassword) {
          const token = await GenerateSignature({
            email: existingCustomer.email,
            _id: existingCustomer._id,
          });
          return FormateData({
            id: existingCustomer._id,
            token,
            name: existingCustomer.name,
            phone: existingCustomer.phone,
            email: existingCustomer.email,
          });
        } else {
          throw new BadRequestError("Wrong Password");
        }
      }
      return FormateData(null);
    } catch (e) {
      throw new APIError(e);
    }
  }

  async SignUp(userInputs) {
    const { email, password, phone, name } = userInputs;

    try {
      let salt = await GenerateSalt();

      let userPassword = await GeneratePassword(password, salt);

      const customer = await this.repository.CreateCustomer({
        email,
        password: userPassword,
        phone,
        name,
        salt,
      });

      const token = await GenerateSignature({
        email: email,
        _id: customer._id,
      });

      return FormateData({
        id: customer._id,
        token,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
      });
    } catch (e) {
      throw new APIError(e);
    }
  }

  async AddNewAddress(_id, userInputs) {
    const { street, postalCode, city, country } = userInputs;

    try {
      const addressResult = await this.repository.CreateAddress({
        _id,
        street,
        postalCode,
        city,
        country,
      });
      return FormateData(addressResult);
    } catch (e) {
      throw new APIError("Data Not found", e);
    }
  }

  async GetProfile(id) {
    try {
      const existingCustomer = await this.repository.FindCustomerById({
        id,
      });
      return FormateData(existingCustomer);
    } catch (e) {
      throw new APIError(e);
    }
  }

  async UpdateProfile(userInputs) {
    try {
      const { _id, name, email, phone, password } = userInputs;

      let newPassword = null;
      if (password) {
        let salt = await GenerateSalt();
        newPassword = await GeneratePassword(password, salt);
      }

      let updates = {
        name,
        email,
        phone,
        password: newPassword,
      };
      if (!name) delete updates.name;
      if (!email) delete updates.email;
      if (!phone) delete updates.phone;
      if (!password) delete updates.newPassword;

      const newCustomer = await this.repository.UpdateCustomer({
        _id,
        updates,
      });

      return FormateData(newCustomer);
    } catch (e) {
      throw new APIError(e);
    }
  }

  async GetShopingDetails(id) {
    try {
      const existingCustomer = await this.repository.FindCustomerById({
        id,
      });

      if (existingCustomer) {
        return FormateData(existingCustomer);
      }
      throw new Error(`Shopping details can't be found`);
    } catch (e) {
      throw new APIError(e);
    }
  }

  async GetWishList(customerId) {
    try {
      const wishListItems = await this.repository.Wishlist(customerId);
      return FormateData(wishListItems);
    } catch (e) {
      throw new APIError(e);
    }
  }

  async AddToWishlist(customerId, product) {
    try {
      const wishlistResult = await this.repository.AddWishlistItem(
        customerId,
        product
      );
      return FormateData(wishlistResult);
    } catch (e) {
      throw new APIError(e);
    }
  }

  async ManageCart(customerId, product, qty, isRemove) {
    try {
      const cartResult = await this.repository.AddCartItem(
        customerId,
        product,
        qty,
        isRemove
      );
      return FormateData(cartResult);
    } catch (e) {
      throw new APIError(e);
    }
  }

  async ManageOrder(customerId, order) {
    try {
      const orderResult = await this.repository.AddOrderToProfile(
        customerId,
        order
      );
      return FormateData(orderResult);
    } catch (e) {
      throw new APIError(e);
    }
  }

  async SubscribeEvents(payload) {
    try {
      const { event, data } = payload;

      const { userId, product, order, qty } = data;

      switch (event) {
        case "ADD_TO_WISHLIST":
          await this.AddToWishlist(userId, product);
          break;
        case "REMOVE_FROM_WISHLIST":
          await this.AddToWishlist(userId, product);
          break;
        case "ADD_TO_CART":
          await this.ManageCart(userId, product, qty, false);
          break;
        case "REMOVE_FROM_CART":
          await this.ManageCart(userId, product, qty, true);
          break;
        case "CREATE_ORDER":
          await this.ManageOrder(userId, order);
          break;
        default:
          break;
      }
    } catch (e) {
      console.log("HEllo");
      throw new AsyncAPIError(e);
    }
  }
}

module.exports = CustomerService;
