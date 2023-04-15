const axios = require("axios");

const url = "https://codeforces.com/api/";

async function getUserInfo(handle) {
  const data = (await axios.get(url + "user.info?handles=" + handle)).data
  return data;
}

async function getContests(gym = false) {
  const data = (await axios.get(url + "contest.list?gym=" + gym)).data;
  return data;
}

async function getNextContests(gym = false) {
  let contests = await getContests(gym);
  return contests.result.filter(contest => contest.relativeTimeSeconds <= 0);
}

function padNumber(x, qtd = 2, c = '0') {
  return x.toString().padStart(qtd, c);
}

function format(date) {
  let dd = date.getDate();
  let mm = date.getMonth() + 1;
  let yy = date.getFullYear();
  let hh = date.getHours() - 3;
  let min = date.getMinutes();
  return {
    date: `${padNumber(dd)}/${padNumber(mm)}/${yy}`,
    hour: `${padNumber(hh)}:${padNumber(min)}`
  };
}

async function getUserStatus(handle) {
  const data = (await axios.get(url + "user.status?handle=" + handle)).data;
  return data;
}

module.exports = {
  getUserInfo,
  getNextContests,
  getUserStatus,
  format
}