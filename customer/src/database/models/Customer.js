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
			{ type: Schema.Types.ObjectId, ref: "address", required: true },
		],
		cart: [
			{
				product: {
					_id: { type: String, required: true },
					name: { type: String },
					banner: { type: String },
					price: { type: Number },
				},
				unit: { type: Number, required: true },
			},
		],
		wishlist: [
			{
				_id: { type: String, required: true },
				name: { type: String },
				description: { type: String },
				banner: { type: String },
				available: { type: Boolean },
				price: { type: Number },
			},
		],
		orders: [
			{
				_id: { type: String, required: true },
				amount: { type: String },
				date: { type: Date, default: Date.now() },
			},
		],
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
