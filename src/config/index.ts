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
        POSTGRES_URI: 'postgres://username:password@hostname/databasename',
        API: '/api/v1',
        COR_ORIGIN: DEBUG ? 'http://localhost:3000',
        ACCESS_TOKEN_SECRET: 'ACCESS_TOKEN_SECRET',
        REFRESH_TOKEN_SECRET: 'REFRESH_TOKEN_SECRET',
        CLOUD_NAME: 'dyhzak5ed',
        API_KEY: '667478132612627',
        API_SECRET: '',
        USER_EMAIL: '',
        PASSWORD_EMAIL: '',
        HOST_EMAIL: '',
        ORDER_STATUS: {
            CREATED: 0,
            PAID: 1,
            DELIVERING: 2,
            DELIVERED: 3,
            CANCELED: 4,
        },
        ROLE: {
            ADMIN: 'ADMIN',
            CUSTOMER: 'CUSTOMER',
        },
        TYPE_ACCOUNT: {
            GOOGLE: 0,
            FACEBOOK: 1,
            EMAIL: 2,
        },
        TYPE_UPDATE_ORDER: {
            ADD_PRODUCT: 0,
            REMOVE_PRODUCT: 1,
        },
    };

    return config;
};
