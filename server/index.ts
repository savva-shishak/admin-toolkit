require('dotenv').config();

import { httpServer } from "./app/context";
import { sequelize } from "./app/context/database";
import logger from './logger';

import "./app/admin";
import "./app/shop";

async function runServers() {
  logger.info('Sinc with database');
  await sequelize.sync({ });
  logger.info('Database sincronized');

  logger.info('Starting media server');
  
  httpServer.listen(
    process.env.SERVER_PORT || 8080,
    () => logger.info(`Server started: http${process.env.SSL_MODE === 'off' ? '' : 's'}://localhost:${process.env.SERVER_PORT || 8080}`),
  );
}

runServers();
