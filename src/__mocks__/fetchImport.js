/* eslint-disable no-undef */
const fetch = jest.fn((objectsOfEachLink) => Promise.resolve({ status: 200, ok: 'OK' }));

module.exports = {
  fetch,
};
