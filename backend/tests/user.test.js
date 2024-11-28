import { mockUsers } from '../mockData.js';
import User from '../models/User.js';

jest.mock('../models/User.js');

describe('Users', () => {
  it('should fetch all users', async () => {
    User.findAll.mockResolvedValue(mockUsers);

    const users = await User.findAll();
    expect(users).toEqual(mockUsers);
    expect(users.length).toBe(2);
  });
});