import * as Papa from "papaparse";
import axios from "axios";

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

export const parseUrl = async (url) => {
  const config = { headers: { accept: 'text/csv' }, responseType: 'blob' };
  const response = await axios.get(url, config);
  return parseFile(response.data, true);
};
