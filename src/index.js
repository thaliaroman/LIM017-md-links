/* eslint-disable import/prefer-default-export */
/* eslint-disable no-undef */
/* eslint-disable consistent-return */
/* eslint no-use-before-define: 0 */ // --> OFF
// eslint-disable-next-line no-useless-escape
const {
  getAbsolutePath,
  getLinkObjects,
  validateLinks,
} = require('./util.js');

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

const totalAndUnique = (path) => {
  const objectsOfEachLink = (getLinkObjects(path));
  const total = `Total: ${objectsOfEachLink.length}`;
  const links = objectsOfEachLink.map((objectLink) => (objectLink.href));
  const uniqueLinks = new Set(links);
  const unique = `Unique: ${[...uniqueLinks].length}`;
  return `${total} \n${unique}`;
};

module.exports = {
  mdLinks,
  totalAndUnique,
};
