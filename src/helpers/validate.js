// Axios for making requests
import axios from "axios";
import { Table } from "tableschema";

const config = require("./config.json");

export const validate = async (schema_name, data) => {
  let schema = await getSchemaDefinition(schema_name);
  let valid = await validateData(schema, data);
  return valid;
};

export const validateData = async (schema, data) => {
  const table = await Table.load(data, { schema: schema });
  try {
    await table.read();
  } catch (error) {
    return false;
  }
  return true;
};

export const getSchemaDefinition = async schema_name => {
  let response = await axios.get(
    config.schema_path + config.schemas[schema_name].version + "/" + schema_name + ".json"
  );
  return response.data;
};
