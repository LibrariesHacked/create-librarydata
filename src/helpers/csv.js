import * as Papa from "papaparse";

export function parseFile(rawFile) {
  return new Promise(resolve => {
    let data = [];
    Papa.parse(rawFile, {
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
}
