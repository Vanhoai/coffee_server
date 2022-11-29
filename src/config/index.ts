export const getConfig = () => {
    const DEBUG = true;

    const config = {
        LOCAL: DEBUG,
        POSTGRES_HOST: DEBUG ? '127.0.0.1' : 'database',
        POSTGRES_PORT: DEBUG ? 5432 : 5434,
        POSTGRES_USER: 'postgres',
        POSTGRES_PASSWORD: DEBUG ? 'Tranhoai241223' : 'postgres',
        POSTGRES_DB: 'coffee',
        PORT: DEBUG ? 8080 : process.env.PORT,
        POSTGRES_URI: DEBUG
            ? 'postgres://username:password@hostname/databasename'
            : 'postgres://sweqjour:QMdhbPmLX5v26h8ULPzlIiTlY1CuUan9@tiny.db.elephantsql.com/sweqjour',
        API: '/api/v1',
        COR_ORIGIN: DEBUG ? 'http://localhost:3000' : 'https://coffee-shop-frontend.vercel.app',
        ACCESS_TOKEN_SECRET: 'ACCESS_TOKEN_SECRET',
        REFRESH_TOKEN_SECRET: 'REFRESH_TOKEN_SECRET',
        CLOUD_NAME: 'dyhzak5ed',
        API_KEY: '667478132612627',
        API_SECRET: '6wCTl19e57JKU6a4YebhTqt7cC8',
        USER_EMAIL: 'tvhoai241223@gmail.com',
        PASSWORD_EMAIL: 'obcgyhgmvkunuufh',
        HOST_EMAIL: 'smtp.gmail.com',
        ORDER_STATUS: {
            CREATED: 0,
            PAID: 1,
            DELIVERING: 2,
            DELIVERED: 3,
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
