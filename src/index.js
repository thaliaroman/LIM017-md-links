/* eslint-disable no-debugger */
/* eslint-disable no-console */
/* eslint no-use-before-define: 0 */ // --> OFF
const {
  getAbsolutePath,
  getLinkObjects,
  validateLinks,
} = require('./controllers.js');

const mdLinks = (path, options = { validate: false }) => new Promise((resolve, reject) => {
  const convertPath = getAbsolutePath(path);
  if (convertPath === '') {
    reject('the path is invalid');
  } else {
    const arrayOfObjects = getLinkObjects(convertPath);
    if (arrayOfObjects.length > 0) {
      if (options.validate) {
        resolve(validateLinks(arrayOfObjects));
      } else {
        resolve(arrayOfObjects);
      }
    } else {
      reject('there are no links');
    }
  }
});

mdLinks('./mydirectory', { validate: true })
  .then((resolve) => console.log(resolve))
  .catch((error) => console.log(error));

module.exports = {
  mdLinks,
};
