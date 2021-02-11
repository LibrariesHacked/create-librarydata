// Axios for making requests
import axios from "axios";

const config = require("./config.json");

export function extractPostcodeSectors(postcode_list) {
  let sectors = new Set(
    postcode_list
      .map(postcode => extractPostcodeSector(postcode))
      .filter(sector => sector != null)
  );
  return [...sectors];
}

export function extractPostcodeSector(postcode) {
  const re = /[a-zA-Z]+\d\d?[a-zA-Z]?\s*\d+/;
  if (postcode) {
    let match = postcode.match(re);
    if (match && match.length > 0) return match[0].substring(0, 6);
  }
  return null;
}

export function getLsoasFromPostcodeSectors(sectors, callback) {
  axios.post(config.postcode_api + "lsoas?filter=sector", sectors).then(response => {
    callback(response.data);
  });
}

export function extractLsoaLookupFromPostcodes(postcode_list, callback) {
  // First thing to do is extract all the postcode sectors
  const sectors = extractPostcodeSectors(postcode_list);
  // Then we retrieve all the LSOA data
  let postcodes = {};
  getLsoasFromPostcodeSectors(sectors, lsoas => {
    Object.keys(lsoas).forEach(lsoa => {
      lsoas[lsoa].forEach(postcode => {
        postcodes[postcode.replace(/\s/g, "")] = lsoa.trim();
      });
    });
    callback(postcodes);
  });
}
