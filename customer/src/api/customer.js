const { MAIL_BINDING_KEY } = require("../config");
const Auth = require("../middlewares/auth");
const CustomerService = require("../services/customer-service");
const { SubscribeMessage, PublishMessage } = require("../utils");
const { RedisGET, RedisSET, RedisDEL } = require("../utils/cache");

module.exports = (app, channel, redisClient) => {
	const service = new CustomerService();
	SubscribeMessage(channel, service);

	app.post("/signup", async (req, res, next) => {
		try {
			const { email, password, phone, name } = req.body;
			const { data } = await service.SignUp({
				email,
				password,
				phone,
				name,
			});

			const publishData = {
				sms_notification: data.sms_notification,
				email_notification: data.email_notification,
				phone: data.phone,
				name: data.name,
				email: data.email,
				id: data.id,
			};

			PublishMessage(
				channel,
				MAIL_BINDING_KEY,
				JSON.stringify({ ...publishData, event: "profile_registered" })
			);

			return res.json({ success: true, data });
		} catch (e) {
			next(e);
		}
	});

	app.post("/login", async (req, res, next) => {
		try {
			const { phone, password } = req.body;

			const { data } = await service.SignIn({ phone, password });

			const publishData = {
				sms_notification: data.sms_notification,
				email_notification: data.email_notification,
				phone: data.phone,
				name: data.name,
				email: data.email,
				id: data.id,
			};

			PublishMessage(
				channel,
				MAIL_BINDING_KEY,
				JSON.stringify({ ...publishData, event: "profile_loggedin" })
			);

			return res.json({ success: true, data });
		} catch (e) {
			next(e);
		}
	});

	app.post("/address", Auth, async (req, res, next) => {
		try {
			const { _id } = req.user;

			const { street, postalCode, city, country } = req.body;

			const { data } = await service.AddNewAddress(_id, {
				street,
				postalCode,
				city,
				country,
			});
			return res.json({ success: true, data });
		} catch (e) {
			next(e);
		}
	});

	app.get("/profile", Auth, async (req, res, next) => {
		try {
			const { _id } = req.user;
			var profile = await RedisGET(redisClient, `${_id}#profile`);
			var from_cache = true;

			if (!profile) {
				const { data } = await service.GetProfile({ _id });
				profile = data;
				from_cache = false;
				const status = await RedisSET(
					redisClient,
					`${_id}#profile`,
					JSON.stringify(profile),
					30
				);
			} else {
				profile = JSON.parse(profile);
			}
			return res.json({ success: true, data: profile, from_cache });
		} catch (e) {
			next(e);
		}
	});

	app.put("/profile", Auth, async (req, res, next) => {
		try {
			const { _id } = req.user;
			const {
				email,
				password,
				phone,
				name,
				sms_notification,
				email_notification,
			} = req.body;

			const { data } = await service.UpdateProfile({
				_id,
				email,
				password,
				phone,
				name,
				sms_notification,
				email_notification,
			});

			const publishData = {
				sms_notification: data.sms_notification,
				email_notification: data.email_notification,
				phone: data.phone,
				name: data.name,
				email: data.email,
				id: data._id,
			};
			await RedisDEL(redisClient, `${_id}#profile`);

			PublishMessage(
				channel,
				MAIL_BINDING_KEY,
				JSON.stringify({ ...publishData, event: "profile_updated" })
			);

			return res.json({ success: true, data });
		} catch (e) {
			next(e);
		}
	});

	app.get("/shoping-details", Auth, async (req, res, next) => {
		try {
			const { _id } = req.user;
			const { data } = await service.GetShopingDetails(_id);
			return res.json({ success: true, data });
		} catch (e) {
			next(e);
		}
	});

	app.get("/wishlist", Auth, async (req, res, next) => {
		try {
			const { _id } = req.user;
			const { data } = await service.GetWishList(_id);
			return res.json({ success: true, data });
		} catch (e) {
			next(e);
		}
	});
};
