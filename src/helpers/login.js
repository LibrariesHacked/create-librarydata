import axios from "axios";

const config = require("./config.json");

export async function login(email) {
  try {
    const response = await axios.post(config.authenticate_path, { email: email, website: config.authenticate_website });
    if (response && response.status === 200) return true;
  } catch (err) { 
    return false
  }
  return false;
}
