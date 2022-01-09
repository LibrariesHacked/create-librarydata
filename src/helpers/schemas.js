const config = require("../helpers/config.json");
import * as csvHelper from "../helpers/csv";

export const getLibrarySchemaData = async (localAuthorityCode) => {
  const url = `${config.libraries_data_url}${localAuthorityCode}`;
  const data = await csvHelper.parseUrl(url);
  return data;
};

export const saveLibrarySchema = (localAuthorityCode) => {

};

export const validate = async (schemaName, data) => {
  return true;
};