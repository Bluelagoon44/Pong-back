const { register, login } = require('../../controller/auth.controller');

describe('auth.routes', () => {
  it('POST /register should validate fields', async () => {
    // Mock req/res
    const req = { body: {} };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
  // ...autres cas d'intégration
});
