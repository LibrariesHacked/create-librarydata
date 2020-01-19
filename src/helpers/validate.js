// Axios for making requests
import axios from "axios";
import { Table } from "tableschema";

const config = require("./config.json");

export async function validate(schema_name, data) {
  let schema = await getSchemaDefinition(schema_name);
  let valid = await validateData(schema, data);
  return valid;
}

export async function validateData(schema, data) {
  const table = await Table.load(data, { schema: schema });
  try {
    await table.read();
  } catch (error) {
    return false;
  }
  return true;
}

export async function getSchemaDefinition(schema_name) {
  let response = await axios.get(
    config.schema_path +
      config.schemas[schema_name].version +
      "/" +
      schema_name +
      ".json"
  );
  return response.data;
}
