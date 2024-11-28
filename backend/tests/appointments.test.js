import { mockAppointments } from '../mockData.js';
import Appointment from '../models/Appointment.js';

jest.mock('../models/Appointment.js');

describe('Appointments', () => {
  it('should fetch all appointments', async () => {
    Appointment.findAll.mockResolvedValue(mockAppointments);

    const appointments = await Appointment.findAll();
    expect(appointments).toEqual(mockAppointments);
    expect(appointments.length).toBe(2);
  });
});