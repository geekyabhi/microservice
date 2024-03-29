const ProductService = require("../services/product-service");
const Auth = require("../middlewares/auth");
const { PublishMessage } = require("../utils");
const { CUSTOMER_BINDING_KEY, SHOPPING_BINDING_KEY } = require("../config");
const { RedisGET, RedisSET } = require("../utils/cache");

module.exports = (app, channel, redisClient) => {
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
			const { ids } = req.body;
			var products = await RedisGET(redisClient, "/products/selected");
			var from_cache = true;
			if (!products) {
				products = await service.GetSelectedProducts(ids);
				from_cache = false;
				const status = await RedisSET(
					redisClient,
					"/products/selected",
					JSON.stringify(products),
					30
				);
			} else {
				products = JSON.parse(products);
			}
			return res
				.status(200)
				.json({ success: true, data: products, from_cache });
		} catch (err) {
			next(err);
		}
	});

	app.get("/:id", async (req, res, next) => {
		const productId = req.params.id;
		try {
			var products = await RedisGET(
				redisClient,
				`/products/${productId}`
			);
			var from_cache = true;

			if (!products) {
				const { data } = await service.GetProductDescription(productId);
				products = data;
				from_cache = false;
				const status = await RedisSET(
					redisClient,
					`/products/${productId}`,
					JSON.stringify(products),
					30
				);
			} else {
				products = JSON.parse(products);
			}

			return res
				.status(200)
				.json({ success: true, data: products, from_cache });
		} catch (err) {
			next(err);
		}
	});

	app.get("/", async (req, res, next) => {
		const query = req.query;
		try {
			var products = await RedisGET(
				redisClient,
				`/products/all/` + JSON.stringify(query)
			);
			var from_cache = true;
			if (!products) {
				const { data } = await service.GetProducts(query);
				products = data;
				from_cache = false;
				const status = await RedisSET(
					redisClient,
					`/products/all/` + JSON.stringify(query),
					JSON.stringify(products),
					30
				);
			} else {
				products = JSON.parse(products);
			}
			return res
				.status(200)
				.json({ success: true, data: products, from_cache });
		} catch (error) {
			next(error);
		}
	});

	app.put("/wishlist/:id", Auth, async (req, res, next) => {
		const { _id } = req.user;
		try {
			const { data: payload } = await service.GetProductPayload(
				_id,
				{ productId: req.params.id },
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

			console.log(payload);

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
