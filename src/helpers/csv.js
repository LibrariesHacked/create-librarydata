import * as Papa from "papaparse";

export const parseFile = (rawFile, header) => {
  return new Promise(resolve => {
    let data = [];
    Papa.parse(rawFile, {
      skipEmptyLines: true,
      worker: true,
      header: header,
      step: results => {
        data.push(results.data);
      },
      complete: () => {
        resolve(data);
      }
    });
  });
};

export const parseUrl = url => {
  return new Promise(resolve => {
    let data = [];
    Papa.parse(url, {
      download: true,
      skipEmptyLines: true,
      worker: true,
      step: results => {
        data.push(results.data);
      },
      complete: () => {
        resolve(data);
      }
    });
  });
};
