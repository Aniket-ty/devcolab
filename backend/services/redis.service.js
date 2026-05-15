import Redis from 'ioredis';

const redisClient = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,

    retryStrategy(times) {
        return Math.min(times * 100, 3000);
    },

    enableReadyCheck: false,

    lazyConnect: false,

    tls: {},
});

redisClient.on('connect', () => {
    console.log('✅ Redis connected');
});

redisClient.on('ready', () => {
    console.log('✅ Redis ready');
});

redisClient.on('error', (err) => {
    console.error('❌ Redis error:', err.message);
});

export default redisClient;