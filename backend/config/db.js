import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false, // Disable logging to keep it clean
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Database connected');
    await sequelize.sync({ alter: true });  // Sync all models to database
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
};

export default sequelize;
export { connectDB };