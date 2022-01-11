import axios from "axios";

const config = require("./config.json");

export async function getLibraryAuthorities() {
  const response = await axios.get(config.authorities_path);
  if (response && response.data) {
    return response.data;
  } else {
    return [];
  }
}

export async function getLibraryAuthorityByName(name) {
  const response = await axios.get(config.authorities_path + "/name/" + name);
  if (response && response.data) {
    return response.data;
  } else {
    return {};
  }
}

export function getLibraryAuthoritySystemName(name) {
  return name.replace(/[. ,:-]+/g, '-').toLowerCase()
}
