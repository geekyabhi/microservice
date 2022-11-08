const ProductService = require("../services/product-service");
const Auth = require("../middlewares/auth");
const { PublishCustomerEvent, PublishShoppingEvent } = require("../utils");

module.exports = (app) => {
	const service = new ProductService();

	app.post("/product/create", async (req, res, next) => {
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
			// validation
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

	app.get("/category/:type", async (req, res, next) => {
		const type = req.params.type;

		try {
			const { data } = await service.GetProductsByCategory(type);
			return res.status(200).json({ success: true, data });
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

	app.post("/ids", async (req, res, next) => {
		try {
			const { ids } = req.body;
			const products = await service.GetSelectedProducts(ids);
			return res.status(200).json({ success: true, data: products });
		} catch (err) {
			next(err);
		}
	});

	app.put("/wishlist", Auth, async (req, res, next) => {
		const { _id } = req.user;
		try {
			const {data:payload}=await service.GetProductPayload(_id,{productId:req.body._id},'ADD_TO_WISHLIST')
			PublishCustomerEvent(payload)
			return res.status(200).json({ success: true, data: payload.data.product });
		} catch (err) {}
	});

	app.delete("/wishlist/:id", Auth, async (req, res, next) => {
		const { _id } = req.user;
		const productId = req.params.id;

		try {
			const {data:payload}=await service.GetProductPayload(_id,{productId},'REMOVE_FROM_WISHLIST')
			PublishCustomerEvent(payload)
			return res.status(200).json({ success: true, data: payload.data.product });
		} catch (err) {
			next(err);
		}
	});

	app.put("/cart", Auth, async (req, res, next) => {
		const {_id} = req.user;

		try {
			const {data:payload}=await service.GetProductPayload(_id,{productId:req.body._id,qty:req.body.qty},'ADD_TO_CART')

			PublishCustomerEvent(payload)
			PublishShoppingEvent(payload)

			return res.status(200).json({ success: true, data:{
				product:payload.data.product,
				unit:payload.data.qty
			}});
		} catch (err) {
			next(err);
		}
	});

	app.delete("/cart/:id", Auth, async (req, res, next) => {
		const { _id } = req.user;
		const productId=req.params.id

		try {
			const {data:payload}=await service.GetProductPayload(_id,{productId},'REMOVE_FROM_CART')

			PublishCustomerEvent(payload)
			PublishShoppingEvent(payload)

			return res.status(200).json({ success: true, data: {
				product:payload.data.product,
				unit:payload.data.qty
			} });
		} catch (err) {
			next(err);
		}
	});

	//get Top products and category
	app.get("/", async (req, res, next) => {
		//check validation
		try {
			const { data } = await service.GetProducts();
			return res.status(200).json({ success: true, data });
		} catch (error) {
			next(err);
		}
	});
};
