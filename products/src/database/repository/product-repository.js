const {
	BadRequestError,
	APIError,
	STATUS_CODES,
} = require("../../utils/error/app-errors");
const { ProductModel } = require("../models");

class ProductRepository {
	async CreateProduct({
		name,
		desc,
		type,
		unit,
		price,
		available,
		suplier,
		banner,
	}) {
		try {
			const product = new ProductModel({
				name,
				desc,
				type,
				unit,
				price,
				available,
				suplier,
				banner,
			});

			const productResult = await product.save();
			return productResult;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Unable to Create Product ${e}`
			);
		}
	}

	async Products() {
		try {
			return await ProductModel.find();
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Unable to Get Products ${e}`
			);
		}
	}

	async FindById(id) {
		try {
			return await ProductModel.findById(id);
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Unable to Find Product ${e}`
			);
		}
	}

	async FindByCategory(category) {
		try {
			const products = await ProductModel.find({ type: category });
			return products;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Unable to Find Category ${e}`
			);
		}
	}

	async FindSelectedProducts(selectedIds) {
		try {
			const products = await ProductModel.find()
				.where("_id")
				.in(selectedIds.map((_id) => _id))
				.exec();
			return products;
		} catch (e) {
			throw new APIError(
				"API Error",
				STATUS_CODES.INTERNAL_ERROR,
				`Unable to Find Product ${e}`
			);
		}
	}
}

module.exports = ProductRepository;
