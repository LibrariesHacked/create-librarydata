// Axios for making requests
import axios from "axios";

const config = require("./config.json");

export function getSchemaDefinition(schema_name, callback) {
  axios
    .get(
      config.schema_path +
        config.schemas[schema_name].version +
        "/" +
        schema_name +
        ".json"
    )
    .then(response => {
      callback(response.data);
    });
}
