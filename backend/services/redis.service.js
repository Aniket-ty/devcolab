import Redis from 'ioredis';

// Supports both:
//   REDIS_URL=rediss://... (Upstash / any cloud provider — preferred)
//   REDIS_HOST + REDIS_PORT + REDIS_PASSWORD (legacy local config)
// Falls back to localhost:6379 for local dev when neither is set.

const redisOptions = {
    retryStrategy: (times) => Math.min(times * 500, 30000),
    lazyConnect:   true,
    enableReadyCheck: true,
    // Upstash requires TLS; the rediss:// URL carries this automatically.
    // For local Redis (redis://) TLS is not needed.
};

const redisClient = process.env.REDIS_URL
    ? new Redis(process.env.REDIS_URL, redisOptions)
    : new Redis({
        host:     process.env.REDIS_HOST     || 'localhost',
        port:     parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        ...redisOptions
    });

redisClient.on('connect',   () => console.log('✅ Redis connected'));
redisClient.on('ready',     () => console.log('✅ Redis ready'));
redisClient.on('error',     (err) => console.error('❌ Redis error:', err.message));
redisClient.on('reconnecting', () => console.log('🔄 Redis reconnecting...'));

// Connect on startup (lazy — won't throw if unavailable yet)
redisClient.connect().catch(() => {});

export default redisClient;
