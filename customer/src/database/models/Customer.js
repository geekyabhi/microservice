const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
	{
		email: { type: String },
		password: { type: String, required: true },
		salt: { type: String },
		phone: { type: String, unique: true, required: true },
		name: { type: String, required: true },
		address: [
			{ type: Schema.Types.ObjectId, ref: "address", require: true },
		],
		cart: [
			{
				product: {
					type: Schema.Types.ObjectId,
					ref: "product",
					require: true,
				},
				unit: { type: Number, require: true },
			},
		],
		wishlist: [
			{
				type: Schema.Types.ObjectId,
				ref: "product",
				require: true,
			},
		],
		orders: [{ type: Schema.Types.ObjectId, ref: "order", require: true }],
	},
	{
		toJSON: {
			transform(doc, ret) {
				delete ret.password;
				delete ret.salt;
				delete ret.__v;
			},
		},
		timestamps: true,
	}
);

module.exports = mongoose.model("customer", CustomerSchema);
