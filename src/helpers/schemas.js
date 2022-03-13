const config = require("../helpers/config.json");
import axios from "axios";
import * as csvHelper from "../helpers/csv";

export const getSchemaData = async (schemaName, localAuthorityCode) => {
  const url = `${config.schema_url}${schemaName}/${localAuthorityCode}`;
  const data = await csvHelper.parseUrl(url);
  return data;
};

export const saveSchemaFile = async (schemaName, localAuthorityCode, content, loginKey) => {
  const url = `${config.schema_url}${schemaName}/${localAuthorityCode}`;
  const result = await axios.put(url, content, {
    headers: {
      'Authorization': `Bearer ${loginKey}`, 'Content-Type': 'text/csv'
    }
  });
  return result.status === 200;
};
