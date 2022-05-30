const fs = require('fs');
const path = require('path');
const md = require('markdown-it')();
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fetch = require('node-fetch');

const getAbsolutePath = (route) => {
    const error = ''
    if(!fs.existsSync(route)) {
        return error}
        else if (fs.existsSync(route) && !path.isAbsolute(route)) {
        return path.resolve(route)}
        else {return route}
    }

const getmdFileRoutes = (route) => {
    route = getAbsolutePath(route);
    mdFileRoutes = [];
    if(fs.statSync(route).isFile()){
        if(path.extname(route) === '.md'){
        mdFileRoutes.push(route)
        }
    }
    else{
        let directory = route
        fs.readdirSync(route).forEach(file => {
            const absolute = path.join(directory, file)
            mdFileRoutes= mdFileRoutes.concat(getmdFileRoutes(route=absolute));
        })
    }
    return mdFileRoutes;
}

const getLinkObjects = (route) =>{
    objectsOfEachLink = [];
    const mdFileRoutes = getmdFileRoutes(route);
    for (const mdFileRoute of mdFileRoutes){
        mdFileContent = fs.readFileSync(mdFileRoute, 'utf8')
        mdFileContentWhitHtmlFormat = md.render(mdFileContent);
        aLabels = new JSDOM(mdFileContentWhitHtmlFormat).window.document.getElementsByTagName('a')
        for (const a of aLabels){
                const objectLink ={
                    href:a.href,
                    text:a.textContent,
                    file:mdFileRoute,
                };
                objectsOfEachLink.push(objectLink);
            }
        }
    return objectsOfEachLink;
}

const validateLinks = (objectsOfEachLink)=>{
    let arrayPromises = [];
    arrayPromises = objectsOfEachLink.map((objectLink) => fetch(objectLink.href)
    .then((resolve) => {
        return {
          ...objectLink,
          status: resolve.status,
          ok: resolve.statusText,
        };
    })
    .catch((error) => {
        return{
        ...objectLink,
        status: 'was not resolved',
        ok: 'falló',
        };
    }))
    return Promise.all(arrayPromises);
  }

// validateLinks(getLinkObjects('sampleDirectory/directory3/archive3.md'))
// .then((resolve) => console.log(resolve));

module.exports = {
    getAbsolutePath,
    getmdFileRoutes,
    getLinkObjects,
    validateLinks
    }