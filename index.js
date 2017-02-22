#!/usr/bin/env node

'use strict'

const axios = require('axios');
const cheerio = require('cheerio');
const Table = require('cli-table');
const colors = require('colors');

const url = 'http://www.bmkg.go.id/gempabumi/gempabumi-terkini.bmkg'

axios.get(url).then(response => {
  var $ = cheerio.load(response.data);
  var latestGempa = $('.table.table-hover.table-striped').children('tbody').children('tr');

  // console.log(latestGempa[0].children[1].children); //  nomor
  var time      = latestGempa[0].children[3].children
  var magnitudo = latestGempa[0].children[7].children
  var location  = latestGempa[0].children[11].children[0].children[0].data

  var latest = [];

  latestGempa
    .slice(0, 5)
    .each((x, y) => {
      latest.push({
        time      : y.children[3].children[0].data,
        magnitudo : y.children[7].children[0].data,
        location  : y.children[11].children[0].children[0].data
      });
  });

  return latest;
}).then(latest => {
  var table = new Table({
      head: ['Time', 'Maginitude', 'Location']
  });

// push value to table
  latest.forEach(x=> {
      table.push([x.time, x.magnitudo, x.location]);
  });

  console.log(colors.cyan(table.toString()));

  // console.log(latest);
})
