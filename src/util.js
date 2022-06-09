/* eslint-disable import/no-unresolved */
const fs = require('fs');
const path = require('path');
const md = require('markdown-it')();
const jsdom = require('jsdom');

const { JSDOM } = jsdom;
const {
  fetch,
} = require('./fetchImport.js');

const getAbsolutePath = (route) => {
  const error = '';
  if (!fs.existsSync(route)) {
    return error;
  }
  if (fs.existsSync(route) && !path.isAbsolute(route)) {
    return path.resolve(route);
  }
  return route;
};

const getmdFileRoutes = (route) => {
  let absoluteRoute = getAbsolutePath(route);
  let mdFileRoutes = [];
  if (fs.statSync(absoluteRoute).isFile()) {
    if (path.extname(absoluteRoute) === '.md') {
      mdFileRoutes.push(absoluteRoute);
    }
  } else {
    const directory = absoluteRoute;
    fs.readdirSync(absoluteRoute).forEach((file) => {
      const jointRoute = path.join(directory, file);
      mdFileRoutes = mdFileRoutes.concat(getmdFileRoutes(absoluteRoute = jointRoute));
    });
  }
  return mdFileRoutes;
};

const getLinkObjects = (route) => {
  const objectsOfEachLink = [];
  const mdFileRoutes = getmdFileRoutes(route);
  for (const mdFileRoute of mdFileRoutes) {
    const mdFileContent = fs.readFileSync(mdFileRoute, 'utf8');
    const mdFileContentWhitHtmlFormat = md.render(mdFileContent);
    const aLabels = new JSDOM(mdFileContentWhitHtmlFormat).window.document.getElementsByTagName('a');
    for (const a of aLabels) {
      const objectLink = {
        href: a.href,
        text: a.textContent,
        file: mdFileRoute,
      };
      objectsOfEachLink.push(objectLink);
    }
  }
  return objectsOfEachLink;
};

const validateLinks = (objectsOfEachLink) => {
  let arrayPromises = [];
  arrayPromises = objectsOfEachLink.map((objectLink) => fetch(objectLink.href)
    .then((resolve) => ({
      ...objectLink,
      status: resolve.status,
      ok: (resolve.status >= 200) && (resolve.status <= 399) ? 'ok' : 'fail',
    }))
    .catch(() => ({
      ...objectLink,
      status: 'was not resolved',
      ok: 'falló',
    })));
  return Promise.all(arrayPromises);
};

module.exports = {
  getAbsolutePath,
  getmdFileRoutes,
  getLinkObjects,
  validateLinks,
};
