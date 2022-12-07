const ProductService = require("../services/product-service");
const Auth = require("../middlewares/auth");
const { PublishMessage } = require("../utils");
const { CUSTOMER_BINDING_KEY, SHOPPING_BINDING_KEY } = require("../config");

module.exports = (app, channel) => {
	const service = new ProductService();

	app.post("/", async (req, res, next) => {
		try {
			const {
				name,
				desc,
				type,
				unit,
				price,
				available,
				suplier,
				banner,
			} = req.body;
			const { data } = await service.CreateProduct({
				name,
				desc,
				type,
				unit,
				price,
				available,
				suplier,
				banner,
			});
			return res.json({ success: true, data });
		} catch (err) {
			next(err);
		}
	});

	app.get("/ids", async (req, res, next) => {
		try {
			const { ids } = req.body || [];
			const products = await service.GetSelectedProducts(ids);
			return res.status(200).json({ success: true, data: products });
		} catch (err) {
			next(err);
		}
	});

	app.get("/:id", async (req, res, next) => {
		const productId = req.params.id;
		try {
			const { data } = await service.GetProductDescription(productId);
			return res.status(200).json({ success: true, data });
		} catch (err) {
			next(err);
		}
	});

	app.get("/", async (req, res, next) => {
		const query = req.query;
		try {
			const { data } = await service.GetProducts(query);
			return res.status(200).json({ success: true, data });
		} catch (error) {
			next(err);
		}
	});

	app.put("/wishlist/:id", Auth, async (req, res, next) => {
		const { _id } = req.user;
		try {
			const { data: payload } = await service.GetProductPayload(
				_id,
				{ productId: req.params._id },
				"ADD_TO_WISHLIST"
			);
			PublishMessage(
				channel,
				CUSTOMER_BINDING_KEY,
				JSON.stringify(payload)
			);

			return res
				.status(200)
				.json({ success: true, data: payload.data.product });
		} catch (err) {
			next(err);
		}
	});

	app.delete("/wishlist/:id", Auth, async (req, res, next) => {
		const { _id } = req.user;
		const productId = req.params.id;

		try {
			const { data: payload } = await service.GetProductPayload(
				_id,
				{ productId },
				"REMOVE_FROM_WISHLIST"
			);
			PublishMessage(
				channel,
				CUSTOMER_BINDING_KEY,
				JSON.stringify(payload)
			);

			return res
				.status(200)
				.json({ success: true, data: payload.data.product });
		} catch (err) {
			next(err);
		}
	});

	app.put("/cart/:id", Auth, async (req, res, next) => {
		const { _id } = req.user;

		try {
			const { data: payload } = await service.GetProductPayload(
				_id,
				{ productId: req.params.id, qty: req.body.qty },
				"ADD_TO_CART"
			);

			const cartPayload = {
				event: payload.event,
				customerId: _id,
				data: {
					item: {
						_id: payload?.data?.product?._id,
						name: payload?.data?.product?.name,
						desc: payload?.data?.product?.desc,
						type: payload?.data?.product?.type,
						price: payload?.data?.product?.price,
						banner: payload?.data?.product?.banner,
						suplier: payload?.data?.product?.suplier,
						unit: payload?.data?.product?.unit,
					},
					unit: payload?.data?.product?.unit,
				},
			};

			PublishMessage(
				channel,
				CUSTOMER_BINDING_KEY,
				JSON.stringify(payload)
			);
			PublishMessage(
				channel,
				SHOPPING_BINDING_KEY,
				JSON.stringify(cartPayload)
			);

			return res.status(200).json({
				success: true,
				data: {
					product: payload?.data?.product,
					unit: payload?.data?.qty,
				},
			});
		} catch (err) {
			next(err);
		}
	});

	app.delete("/cart/:id", Auth, async (req, res, next) => {
		const { _id } = req.user;
		const productId = req.params.id;

		try {
			const { data: payload } = await service.GetProductPayload(
				_id,
				{ productId },
				"REMOVE_FROM_CART"
			);

			PublishMessage(
				channel,
				CUSTOMER_BINDING_KEY,
				JSON.stringify(payload)
			);
			PublishMessage(
				channel,
				SHOPPING_BINDING_KEY,
				JSON.stringify(payload)
			);

			return res.status(200).json({
				success: true,
				data: {
					product: payload.data.product,
					unit: payload.data.qty,
				},
			});
		} catch (err) {
			next(err);
		}
	});
};
