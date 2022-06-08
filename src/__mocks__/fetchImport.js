/* eslint-disable no-undef */

module.exports = {
  fetch: jest.fn((objectsOfEachLink) => Promise.resolve({ status: 200, ok: 'OK' })),
};
