import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';
import Doctor from './Doctor.js';

const Appointment = sequelize.define('Appointment', {
  slotDate: { type: DataTypes.DATEONLY, allowNull: false },
  slotTime: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  cancelled: { type: DataTypes.BOOLEAN, defaultValue: false },
  payment: { type: DataTypes.BOOLEAN, defaultValue: false },
  isCompleted: { type: DataTypes.BOOLEAN, defaultValue: false },
});

// Define relationships
User.hasMany(Appointment, { foreignKey: 'userId' });
Appointment.belongsTo(User, { foreignKey: 'userId' });

Doctor.hasMany(Appointment, { foreignKey: 'doctorId' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });

export default Appointment;