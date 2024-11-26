import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Database connected');
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
};

export default sequelize;
export { connectDB };