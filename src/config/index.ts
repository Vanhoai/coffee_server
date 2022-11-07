export const getConfig = () => {
    const DEBUG = true;

    const config = {
        POSTGRES_HOST: '127.0.0.1',
        POSTGRES_PORT: 5432,
        POSTGRES_USER: 'postgres',
        POSTGRES_PASSWORD: 'Tranhoai241223',
        POSTGRES_DB: 'coffee',
        PORT: DEBUG ? 8080 : 80,
        API: '/api/v1',
        COR_ORIGIN: DEBUG ? 'http://localhost:3000' : 'https://coffee-shop-frontend.vercel.app',
        ACCESS_TOKEN_SECRET: 'ACCESS_TOKEN_SECRET',
        REFRESH_TOKEN_SECRET: 'REFRESH_TOKEN_SECRET',
        CLOUD_NAME: 'dyhzak5ed',
        API_KEY: '667478132612627',
        API_SECRET: '6wCTl19e57JKU6a4YebhTqt7cC8',
        ORDER_STATUS: {
            CREATED: 'CREATED',
            PAID: 'PAID',
            DELIVERING: 'DELIVERING',
            DELIVERED: 'DELIVERED',
        },
        ROLE: {
            ADMIN: 'ADMIN',
            CUSTOMER: 'CUSTOMER',
        },
        TYPE_ACCOUNT: {
            GOOGLE: 'GOOGLE',
            FACEBOOK: 'FACEBOOK',
            EMAIL: 'EMAIL',
        },
    };

    return config;
};
