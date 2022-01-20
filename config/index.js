const config = {

    PORT: process.env.PORT || 5000,
    env: process.env.NODE_ENV || "development",

    //If the below line is set to true, the node js will use 'Atlas cloud service' instead of 'MongoDB Compass'(local storage) while running in local host.
    USE_MONGODB_ATLAS: true,

    JWT_EXPIRES: 600,
};

module.exports = config;