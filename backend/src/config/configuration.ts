export default () => ({
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL || undefined,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'travel_assistance',
    ssl:
      process.env.DB_SSL === 'true' ||
      (process.env.NODE_ENV === 'production' &&
        !!process.env.DATABASE_URL &&
        !process.env.DATABASE_URL.includes('localhost')),
    synchronize: process.env.DB_SYNCHRONIZE === 'true' || process.env.NODE_ENV !== 'production',
    logging: process.env.DB_LOGGING === 'true',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'super_secure_travel_jwt_secret_key_2026_xyz!',
    expiration: process.env.JWT_EXPIRATION || '1h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'super_secure_travel_jwt_refresh_secret_key_2026_abc!',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173', 'http://localhost:3000'],
  },
  ai: {
    provider: process.env.AI_PROVIDER || 'smart-engine',
    apiKey: process.env.AI_API_KEY || process.env.GEMINI_API_KEY || '',
  },
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@travelassistance.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456',
  },
});
