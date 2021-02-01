// Axios for making requests
import axios from "axios";

const config = require("./config.json");

export async function getLibraryAuthorityByName(name) {
  const response = await axios.get(config.authorities_path + "/name/" + name);
  if (response && response.data) {
    return response.data;
  } else {
    return {};
  }
}
