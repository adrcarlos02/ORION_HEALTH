import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Doctor = sequelize.define('Doctor', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  speciality: { type: DataTypes.STRING, allowNull: false },
  degree: { type: DataTypes.STRING, allowNull: false },
  experience: { type: DataTypes.INTEGER, allowNull: false },
  about: { type: DataTypes.TEXT, allowNull: false },
  fees: { type: DataTypes.FLOAT, allowNull: false },
  available: { type: DataTypes.BOOLEAN, defaultValue: true },
  slots_booked: { type: DataTypes.JSON, defaultValue: {} },
}, {
  timestamps: true, // Automatically adds `createdAt` and `updatedAt`
});

export default Doctor;