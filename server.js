const express = require("express");
const axios = require("axios");
const app = express();

// Url is : https://docs.google.com/spreadsheets/d/e/2PACX-1vS5vLFZSFMLsPGhm_JL1DnYk5c28AHJuViQg-e19uekrbViEDnRMW_-eb8fz03khqJ5XgLc3pKpIoM8/pub?gid=0&single=true&output=csv
const url = "https://shorturl.at/jwY67";

app.get("/", async (req, res) => {
  console.log("In request");
  const link = await getTodaysLink();
  res.redirect(link);
  //   res.send(
  //     `<html><body>Redirecting to : <a href="${link}">${link}</a></body></html>`
  //   );
});

app.listen(3000);

async function getTodaysLink() {
  const { data } = await axios.get(url);
  const jsonData = csvJSON(data.replace("\r", ""));
  const today = new Date();
  const date = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  let link = "https://example.com/No-Valid-Date-Found";
  jsonData.forEach((item) => {
    const dt = item.Date;
    const [itemDate, itemMonth, itemYear] = dt.split(".");

    if (
      date === parseInt(itemDate) &&
      month === parseInt(itemMonth) &&
      year === parseInt(itemYear)
    ) {
      link = item.Link;
      console.log("Item found is : ", item);
    }
  });
  return link;
}

// Ref : https://stackoverflow.com/questions/27979002/convert-csv-data-into-json-format-using-javascript
//var csv is the CSV file with headers
function csvJSON(csv) {
  var lines = csv.split("\n");

  var result = [];

  // NOTE: If your columns contain commas in their values, you'll need
  // to deal with those before doing the next step
  // (you might convert them to &&& or something, then covert them back later)
  // jsfiddle showing the issue https://jsfiddle.net/
  var headers = lines[0].split(",");

  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split(",");

    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j].replace("\r", "");
    }

    result.push(obj);
  }

  return result; //JavaScript object
}

console.log("Server started.");
