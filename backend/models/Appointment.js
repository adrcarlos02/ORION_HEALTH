import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';
import Doctor from './Doctor.js';

const Appointment = sequelize.define('Appointment', {
  slotDate: { type: DataTypes.DATEONLY, allowNull: false },
  slotTime: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  cancelled: { type: DataTypes.BOOLEAN, defaultValue: false },
  isCompleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, // Automatically sets the current timestamp
  },
  //userId
});

User.hasMany(Appointment, { foreignKey: 'userId' });
Appointment.belongsTo(User, { foreignKey: 'userId' });

Doctor.hasMany(Appointment, { foreignKey: 'doctorId' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor'});

export default Appointment;