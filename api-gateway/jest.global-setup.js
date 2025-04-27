require("dotenv").config({ path: "./.env.local" });
module.exports = async () => {
  process.env.API_URL = "http://localhost:3000";
  console.log("API url set: ", process.env.API_URL);
};
