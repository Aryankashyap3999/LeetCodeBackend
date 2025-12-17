import Redis from "ioredis";

const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null, 
}

export const redis = new Redis(redisConfig);

redis.on("connect", () => {
    console.log("Connected to Redis server successfully");
});

redis.on("error", (err) => {
    console.error("Redis connection error:", err);
});

export const createNewRedisClient = () => {
    return new Redis(redisConfig);
}   
