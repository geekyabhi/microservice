const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CartSchema = new Schema(
  {
    customerId: { type: String },
    items: [
      {
        products: {
          _id: { type: String, require: true },
          name: { type: String },
          banner: { type: String },
          desc: { type: String },
          type: { type: String },
          unit: { type: Number },
          suplier: { type: String },
          price: { type: Number },
        },
        unit: { type: Number, required: true },
      },
    ],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

module.exports = mongoose.model("cart", CartSchema);
