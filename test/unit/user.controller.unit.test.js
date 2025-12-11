const { register, login } = require('../../controller/auth.controller');

jest.mock('../../prisma/prismaClient.js', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn()
  }
}));

describe('user.controller', () => {
  describe('register', () => {
    it('should return 400 if missing fields', async () => {
      const req = { body: {} };
      const res = { status: jest.fn(() => res), json: jest.fn() };
      await register(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('login', () => {
    it('should return 400 if missing fields', async () => {
      const req = { body: {} };
      const res = { status: jest.fn(() => res), json: jest.fn() };
      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
