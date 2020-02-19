const express = require("express");
const apiKey = "585a83f6c5d6e3b8d2d1812d7098fe7b";
const RajaOngkir = require("rajaongkir-nodejs").Starter(apiKey);
const log = require("morgan");
const bp = require("body-parser");
const app = express();
const port = 3000;

app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));

app.use(log("combined"));

app.get("/", (req, res) => {
  RajaOngkir.getCities()
    .then(function(result) {
      res.json(result.rajaongkir.results);
    })
    .catch(function(error) {
      console.log(error);
    });
});

app.get("/search/:kota", (req, res) => {
  var kota = req.params.kota;
  RajaOngkir.getCities()
    .then(function(result) {
      if (!kota) {
        res.json(result.rajaongkir.results);
      } else {
        var allKota = result.rajaongkir.results;
        var allKotas = [];
        allKota.map((data, i) => {
          var city_name = data.city_name.toLowerCase();
          data.city_name = city_name;
          allKotas.push(data);
          if (allKotas.length === allKota.length) {
            var search = allKotas.filter(data =>
              new RegExp(kota, "i").exec(data.city_name)
            );
            if (search.length > 0) {
              return res.json(search);
            } else {
              return res.json(result.rajaongkir.results);
            }
          }
        });
      }
    })
    .catch(function(error) {
      console.log(error);
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
