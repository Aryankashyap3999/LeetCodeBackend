// This file contains all the basic configuration logic for the app server to work
import dotenv from 'dotenv';

type ServerConfig = {
    PORT: number,
    DB_URL: string,
    SUBMISSION_SERVICE_URL: string,
    PROBLEM_SERVICE_URL: string,
}

function loadEnv() {
    dotenv.config();
    console.log(`Environment variables loaded`);
}

loadEnv();

export const serverConfig: ServerConfig = {
    PORT: Number(process.env.PORT) || 3003,
    DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/default_db',
    SUBMISSION_SERVICE_URL: process.env.SUBMISSION_SERVICE_URL || 'http://localhost:3001/api/v1',
    PROBLEM_SERVICE_URL: process.env.PROBLEM_SERVICE_URL || 'http://localhost:3000/api/v1',

};