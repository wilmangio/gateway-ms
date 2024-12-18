import 'dotenv/config';
import * as joi from 'joi';


interface EnvVars{
    PORT: number;
    NATS_SERVERS: string[];
}

const envsShema = joi.object({
    PORT: joi.number().required(),
    NATS_SERVERS: joi.array().items( joi.string() ).required(),
}).unknown(true);

const { error, value }  = envsShema.validate( {
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if(error){
    throw new Error(`Config validation error: ${ error.message }`);
}

const envVars: EnvVars = value; 

export const envs = {
    port: envVars.PORT,
    natsServers: envVars.NATS_SERVERS,
}

// interface EnvVars{
//     PORT: number;
//     DATABASE_URL: string;
//     PRODUCTS_MICROSERVICE_HOST: string;
//     PRODUCTS_MICROSERVICE_PORT: number;
//     ORDERS_MICROSERVICE_HOST: string;
//     ORDERS_MICROSERVICE_PORT: number;
// }

// const envsShema = joi.object({
//     PORT: joi.number().required(),
//     DATABASE_URL: joi.string().required(),
//     PRODUCTS_MICROSERVICE_HOST: joi.string().required(),
//     PRODUCTS_MICROSERVICE_PORT: joi.number().required(),
//     ORDERS_MICROSERVICE_HOST: joi.string().required(),
//     ORDERS_MICROSERVICE_PORT: joi.number().required(),
// }).unknown(true);

// const { error, value }  = envsShema.validate( process.env );
// if(error){
//     throw new Error(`Config validation error: ${ error.message }`);
// }

// const envVars: EnvVars = value; 

// export const envs = {
//     port: envVars.PORT,
//     databaseUrl: envVars.DATABASE_URL,
//     hostProduct: envVars.PRODUCTS_MICROSERVICE_HOST,
//     portProduct: envVars.PRODUCTS_MICROSERVICE_PORT,
//     hostOrder: envVars.ORDERS_MICROSERVICE_HOST,
//     portOrder: envVars.ORDERS_MICROSERVICE_PORT,
// }