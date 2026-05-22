const redis = require("redis");
const { REDIS_URL } = require("../../config");

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const ConnectRedis = async (retries = 8, delay = 3000) => {
	for (let attempt = 1; attempt <= retries; attempt++) {
		try {
			const redisClient = redis.createClient({ url: REDIS_URL });
			await redisClient.connect();
			console.log(`Redis connected on ${REDIS_URL}`.magenta);
			return redisClient;
		} catch (e) {
			if (attempt < retries) {
				console.log(`[Redis] attempt ${attempt}/${retries} failed — retrying in ${delay}ms...`);
				await sleep(delay);
			} else {
				throw new Error(`Could not connect to Redis after ${retries} attempts: ${e}`);
			}
		}
	}
};

const RedisGET = async (redisClient, key) => {
	try {
		return await redisClient.get(key);
	} catch (e) {
		console.error(`Redis GET error for key ${key}:`, e);
		return null;
	}
};

const RedisSET = async (redisClient, key, value, time = 30, nx = true) => {
	try {
		return await redisClient.set(key, value, { EX: time, NX: nx });
	} catch (e) {
		console.error(`Redis SET error for key ${key}:`, e);
		return null;
	}
};

const RedisDEL = async (redisClient, key) => {
	try {
		return await redisClient.del(key);
	} catch (e) {
		console.error(`Redis DEL error for key ${key}:`, e);
		return null;
	}
};

module.exports = { ConnectRedis, RedisSET, RedisGET, RedisDEL };
