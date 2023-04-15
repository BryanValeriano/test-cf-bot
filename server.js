// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const cfutils = require("./cf/utils.js");
const sheets = require("./sheets.js");

var bodyParser = require("body-parser");
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

const url = "https://codeforces.com/api/";

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.set("json spaces", 2)

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", async (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});
app.get("/test", async (request, response) => {
  response.json(sheets.getRows({
    handle: "jonatas57"
  }))
});

app.post("/cfbot", async (request, response) => {
  var intentName = request.body.queryResult.intent.displayName;

  if (intentName === "rating.lookup") {
    const handle = request.body.queryResult.parameters["handle"];
    let result = await cfutils.getUserInfo(handle);
    let rating = result.result[0].rating;
    response.json({
      fulfillmentMessages: [
        {
          text: {
            text: ["O rating do handle " + handle + " é " + rating.toString()],
          },
        },
      ],
    });
  }
  else if (intentName === "contest.list") {
    const contests = await cfutils.getNextContests(false);
    response.json({
      fulfillmentMessages: [
        {
          text: {
            text: [contests.map(contest => {
              let date = cfutils.format(new Date(contest.startTimeSeconds * 1000));
              let text = `${contest.name}` + "\n" + `Início: ${date.date} às ${date.hour}`;
                return text;
              }).reduce((a, b) => a + "\n\n" + b)
            ]
          },
        },
      ],
    });
  }
  else if (intentName === "list.addProblems") {
    const problems = request.body.queryResult.parameters["problemID"];
    const handle = request.body.queryResult.parameters["handle"];
    const data = [];
    const status = await cfutils.getUserStatus(handle);
    let solved = [];
    status.result.forEach((submission) => {
      if (submission.verdict === "OK") {
        solved.push(submission.contestId + submission.problem.index);
      }
    });
    problems.forEach((problem) => {
      let contestID = "";
      let index = "";
      let idx = false;
      for (var i = 0;i < problem.length;i++) {
        if (problem[i].toUpperCase() !== problem[i].toLowerCase()) idx = true;
        if (idx) index += problem[i];
        else contestID += problem[i];
      }
      data.push({
        id: "INCREMENT",
        handle: handle,
        contestId: parseInt(contestID),
        index: index,
        solved: solved.includes(problem)
      })
    });
    //sheets.addRows(data);
    response.json({
      fulfillmentMessages: [
        {
          text: {
            text: ["ok"]
          },
        },
      ],
    })
  }
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
