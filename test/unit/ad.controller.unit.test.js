const { createAd } = require('../../controller/ad.controller');

describe('ad.controller createAd', () => {
  it('should throw if required fields are missing', async () => {
    const req = { body: {}, userId: 1 };
    const res = { status: jest.fn(() => res), json: jest.fn() };
    await createAd(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String) }));
  });
});
