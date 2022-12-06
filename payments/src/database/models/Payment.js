const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PaymentSchema = new Schema(
	{
		razorpay_order_id: {
			type: String,
			required: true,
		},
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
		customerId: { type: String },
		completed: {
			type: Boolean,
			default: false,
		},
		verified: {
			type: Boolean,
			default: false,
		},
		razorpay_payment_id: {
			type: String,
		},
		razorpay_signature: {
			type: String,
		},
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

module.exports = mongoose.model("Payment", PaymentSchema);
