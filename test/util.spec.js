/* eslint-disable no-undef */
const {
  getAbsolutePath,
  getmdFileRoutes,
  getLinkObjects,
  validateLinks,
} = require('../src/util.js');

jest.mock = require('../src/fetchImport.js');

describe('getAbsolutePath', () => {
  const absoluteRoute = 'C:\\Users\\HP\\Documents\\Laboratoria-LIM017\\MD-links\\LIM017-md-links\\sampleDirectory';
  it('debería convertir la ruta relativa a absoluta', () => {
    expect(getAbsolutePath('./sampleDirectory')).toBe(absoluteRoute);
  });

  const error = '';
  it('debería devolverme un string vacío si la ruta no existe', () => {
    expect(getAbsolutePath('../MyDirectory')).toBe(error);
  });

  const route = 'C:\\Users\\HP\\Documents\\Laboratoria-LIM017\\MD-links\\LIM017-md-links\\sampleDirectory\\directory2\\archive2.md';
  it('Debería devolverme la misma ruta si la ruta es absoluta', () => {
    expect(getAbsolutePath(route)).toBe(route);
  });
});

describe('getmdFileRoutes', () => {
  const mdFileRoutes = [
    'C:\\Users\\HP\\Documents\\Laboratoria-LIM017\\MD-links\\LIM017-md-links\\sampleDirectory\\archive.md',
    'C:\\Users\\HP\\Documents\\Laboratoria-LIM017\\MD-links\\LIM017-md-links\\sampleDirectory\\directory2\\archive2.md',
    'C:\\Users\\HP\\Documents\\Laboratoria-LIM017\\MD-links\\LIM017-md-links\\sampleDirectory\\directory3\\archive3.md',
    'C:\\Users\\HP\\Documents\\Laboratoria-LIM017\\MD-links\\LIM017-md-links\\sampleDirectory\\directory3\\archive4.md',
  ];
  it('Debería devolverme un array de rutas absolutas de archivos.md', () => {
    expect(getmdFileRoutes('./sampleDirectory')).toEqual(mdFileRoutes);
  });
});

describe('getLinkObjects', () => {
  const objectsOfEachLink = [
    {
      href: 'https://nodejs.org/',
      text: 'Node.js',
      file: 'C:\\Users\\HP\\Documents\\Laboratoria-LIM017\\MD-links\\LIM017-md-links\\sampleDirectory\\directory3\\archive3.md',
    },
  ];
  it('Debería devolverme un array de objetos de Links encontrados en los archivos.md', () => {
    expect(getLinkObjects('./sampleDirectory/directory3/archive3.md')).toEqual(objectsOfEachLink);
  });
});

describe('validateLinks', () => {
  const arrayOfEachValidatedLink = [
    {
      href: 'https://nodejs.org/',
      text: 'Node.js',
      file: 'C:\\Users\\HP\\Documents\\Laboratoria-LIM017\\MD-links\\LIM017-md-links\\sampleDirectory\\directory3\\archive3.md',
      status: 200,
      ok: 'ok',
    },
  ];
  it('Debería devolverme un array de objetos de links con las propiedades href,text,file,status,ok', () => {
    return validateLinks(getLinkObjects('./sampleDirectory/directory3/archive3.md'))
      .then((resolve) => {
        expect(resolve).toEqual(arrayOfEachValidatedLink);
      });
  });
  const linksValidatedWithError = [
    {
      href: 'https://www.file.hojadevida.com/',
      text: 'hoja de vida',
      file: 'C:\\Users\\HP\\Documents\\Laboratoria-LIM017\\MD-links\\LIM017-md-links\\sampleDirectory\\directory3\\archive4.md',
      status: 'was not resolved',
      ok: 'falló',
    },
    {
      href: 'http://community.laboratoria.la/c/js',
      text: 'foro de comunidad',
      file: 'C:\\Users\\HP\\Documents\\Laboratoria-LIM017\\MD-links\\LIM017-md-links\\sampleDirectory\\directory3\\archive4.md',
      status: 'was not resolved',
      ok: 'falló',
    },

  ];
  it('debería devolverme el array de objetos de link validados con status: "was not resolved" y ok:"falló"', () => {
    return validateLinks(getLinkObjects('./sampleDirectory/directory3/archive4.md'))
      .catch((error) => {
        expect(error).toEqual(linksValidatedWithError);
      });
  });
  const linksValidatedWithFail = [
    {
      href: 'http://community.laboratoria.la/c/js',
      text: 'foro de comunidad',
      file: 'C:\\Users\\HP\\Documents\\Laboratoria-LIM017\\MD-links\\LIM017-md-links\\sampleDirectory\\directory3\\archive4.md',
      status: 'was not resolved',
      ok: 'falló',
    },
  ];
  it('debería devolverme el array de objetos de link validados con status:404 y ok:"fail"', () => {
    return validateLinks(getLinkObjects('./fail.md'))
      .catch((error) => {
        expect(error).toEqual(linksValidatedWithFail);
      });
  });
});
