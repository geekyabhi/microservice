const { ProductRepository } = require("../database");
const { FormateData } = require("../utils");
const { APIError } = require("../utils/error/app-errors");

class ProductService {
	constructor() {
		this.repository = new ProductRepository();
	}

	async CreateProduct(productInputs) {
		try {
			const productResult = await this.repository.CreateProduct(
				productInputs
			);
			return FormateData(productResult);
		} catch (e) {
			throw new APIError(e);
		}
	}

	async GetProducts() {
		try {
			const products = await this.repository.Products();

			let categories = {};

			products.map(({ type }) => {
				categories[type] = type;
			});

			return FormateData({
				products,
				categories: Object.keys(categories),
			});
		} catch (e) {
			throw new APIError(e);
		}
	}

	async GetProductDescription(productId) {
		try {
			const product = await this.repository.FindById(productId);
			return FormateData(product);
		} catch (e) {
			throw new APIError(e);
		}
	}

	async GetProductsByCategory(category) {
		try {
			const products = await this.repository.FindByCategory(category);
			return FormateData(products);
		} catch (e) {
			throw new APIError(e);
		}
	}

	async GetSelectedProducts(selectedIds) {
		try {
			const products = await this.repository.FindSelectedProducts(
				selectedIds
			);
			return FormateData(products);
		} catch (e) {
			throw new APIError(e);
		}
	}

	async GetProductById(productId) {
		try {
			return await this.repository.FindById(productId);
		} catch (e) {
			throw new APIError(e);
		}
	}

	async GetProductPayload(userId, { productId, qty }, event) {
		try {
			const product = await this.repository.FindById(productId);
			if (product) {
				const payload = {
					event: event,
					data: { userId, product, qty },
				};
				return FormateData(payload);
			} else {
				return FormateData({ error: "No product is available" });
			}
		} catch (e) {
			throw new APIError(e);
		}
	}
}

module.exports = ProductService;
