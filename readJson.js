const fs = require("fs");

const jsonArray = (path) => {
    try {
        const jsonString = fs.readFileSync("./data.json");
        const customer = JSON.parse(jsonString);
        return customer;
      } catch (err) {
        console.log(err);
        return [];
      }
};

module.exports = { jsonArray };
