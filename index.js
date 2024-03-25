require('dotenv').config();
const fs = require("fs");
const http = require("http");
var requests = require("requests");
const homeFile = fs.readFileSync("home.html", "utf8");
const api_key=process.env.API_KEY;
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=jamshedpur&appid=${api_key}`;
const replaceVal = (tempVal, orgVal) => {
  let celcius1 = (orgVal.main.temp - 273.15).toFixed(2);
  let celcius2 = (orgVal.main.temp_min - 273.15).toFixed(2);
  let celcius3 = (orgVal.main.temp_max - 273.15).toFixed(2);
  let temperature = tempVal.replace("{%tempVal%}", celcius1);
  temperature = temperature.replace("{%tempmin%}", celcius2);
  temperature = temperature.replace("{%tempmax%}", celcius3);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(apiUrl)
      .on("data", (chunk) => {
        const objData = JSON.parse(chunk);
        const arrData = [objData];
        const realTimeData = arrData
          .map((value) => replaceVal(homeFile, value))
          .join("");
        res.write(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);

        res.end();
      });
  } else {
    res.end("file not found");
  }
});
server.listen(5000, "127.0.0.1", () => {
  console.log("server started on port 5000");
});
