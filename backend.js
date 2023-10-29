// Liberies init
const PocketBase = require('pocketbase/cjs')
var express = require('express');
var moment = require('moment');
const bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const pb = new PocketBase('http://192.168.41.250:8090');


// Realtime Data
app.get('/realtime', async function(req, res) {
    try{
        // fetch a paginated records list
        const resultList = await pb.collection('wetterdaten_realtime').getList(1, 1, {
            sort: '-created',
        });
        res.json({ 
            temperature: resultList.items[0].temperature,
            humidity: resultList.items[0].humidity,
            pressure: resultList.items[0].pressure,
            altitude: resultList.items[0].altitude,
            time: resultList.items[0].created,
        })
        console.log(resultList.items);
    }catch(err){
        console.log(err);
    }
  });

  app.get('/history', function(req, res) {
    (async () => {
        temp = [];
        pressure = [];
        humidity = [];
        altitude = [];
        windspeed = [];

        const resultList = await pb.collection('wetterdaten_realtime').getList(1, req.query.range, {
            sort: '-created',
        });

        resultList.items.forEach(value => {
            temp.push([moment(value.created).valueOf(), value.temperature]);
            pressure.push([moment(value.created).valueOf(), value.pressure]);
            humidity.push([moment(value.created).valueOf(), value.humidity]);
            windspeed.push([moment(value.created).valueOf(), value.windspeed]);
            altitude.push([moment(value.created).valueOf(), value.altitude]);
        });

        res.json({ 
                temperature: temp,
                windspeed: windspeed,
                pressure: pressure,
                humidity: humidity,
                altitude: altitude
        })
    })().catch(err => {
        console.log(err);
    });
  });

    app.post('/post', (req, res) => {
        res.send(req.body)
        pb.collection('wetterdaten_realtime').create({"temperature": Math.round(req.body.temperature),"pressure": Math.round(req.body.pressure),"humidity": Math.round(req.body.humidity),"altitude": Math.round(req.body.altitude), "windspeed": 0, "status": 1});
    })

// ------------------------------------------------------------------------------------ //

app.listen(80, () => console.log(`Started server at http://localhost:80!`));
