const axios = require("axios");

const url = "https://sheetdb.io/api/v1/6taalk7c2vu3a";
const sheetUrl = "https://docs.google.com/spreadsheets/d/1GGDAWNzTqvEABs4gI7SFmk5GZFkUOmb_biuP6ENt5sc/edit#gid=0";

const addRows = (rows) => {
  axios.post(url, {
    data: rows
  });
}

const removeRows = () => {
}

const updateRows = () => {
}

const getRows = (query) => {
  axios.get(url + "/search", {
    data: query
  })
}

module.exports = {
  addRows,
  getRows
};