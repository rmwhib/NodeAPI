var assert = require('assert')
var restify = require('restify')

//Client

//3 get id from api
const getidandcountry = () =>
  new Promise((resolve, reject) => {
    var clients = require('restify-clients')

    var client = clients.createJsonClient({
      url:
        'https://v1.formula-1.api-sports.io/races?last=2&season=2021&type=race',
    })

    var options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '067e194420437eb916ea0710bf75a011',
        'x-rapidapi-host': 'v1.formula-1.api-sports.io',
      },
    }

    client.get(options, function (err, req, res, obj) {
      assert.ifError(err)

      var firstrace = obj.response[0].id
      var secondrace = obj.response[1].id
      //console.log(last_raceid)

      var ids = []

      var idandcountry = {
        firstrace: firstrace,
        secondrace: secondrace,
      }

      ids.push(idandcountry)

      resolve(ids)
      //return (res = JSON.stringify(obj, null, 2))
    })
  })

//6 get driver from api
const getresults1 = (allids) => {
  console.log(allids)
  return new Promise((resolve, reject) => {
    var clients = require('restify-clients')

    // idandcountry.forEach((racer, index) => {
    //   console.log('racer' + racer.lastrace)

    var client = clients.createJsonClient({
      url:
        'https://v1.formula-1.api-sports.io/rankings/races?race=' +
        allids[0].firstrace,
    })

    var options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '067e194420437eb916ea0710bf75a011',
        'x-rapidapi-host': 'v1.formula-1.api-sports.io',
      },
    }

    client.get(options, function (err, req, res, obj) {
      assert.ifError(err)

      var results = []

      var results2 = obj.response.map((element, index) => {
        var firstracedetails = {
          driver_name: element.driver.name,
          team_name: element.team.name,
          position: element.pos,
          secondid: allids[0].secondrace,
        }

        results.push(firstracedetails)
      })

      //console.log('ready to go results' + JSON.stringify(results))

      resolve(results)
    }) //end of loop
  })
}

const getresults2 = (allids) => {
  console.log('second ID ' + JSON.stringify(allids))
  return new Promise((resolve, reject) => {
    var clients = require('restify-clients')

    var client = clients.createJsonClient({
      url:
        'https://v1.formula-1.api-sports.io/rankings/races?race=' +
        allids[0].secondid,
    })

    var options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '067e194420437eb916ea0710bf75a011',
        'x-rapidapi-host': 'v1.formula-1.api-sports.io',
      },
    }

    client.get(options, function (err, req, res, obj) {
      assert.ifError(err)

      //  var results3 = [allids]

      ///////////////////////////////////////
      ///////////////////////////////////////
      ///////////////////////////////////////
      ///////////////////////////////////////

      var list = [allids]

      function cb(array, callback) {
        var newlist = []

        array.map((element, index) => {
          var secondracedetails = {
            driver_name: element.driver.name,
            team_name: element.team.name,
            position: element.pos,
          }
          newlist.push(secondracedetails)
        })

        callback(newlist)
      }

      cb(obj.response, (res) => list.push(res))

      //////////////////////////////////////////
      ///////////////////////////////////////
      ///////////////////////////////////////
      ///////////////////////////////////////

      //   obj.response.map((element, index) => {
      //     var secondracedetails = {
      //       driver_name: element.driver.name,
      //       team_name: element.team.name,
      //       position: element.pos,
      //     }

      //     results2 = []

      //     results3.push(results2)
      //   })

      console.log('ready to go results' + JSON.stringify(list))

      resolve(list)
    }) //end of loop
  })
}

// 2  call 1st promise
function respond(req, res, next) {
  getidandcountry()
    //getid
    .then((last_raceid) => getresults1(last_raceid))
    //get 1st race
    .then((race1) => getresults2(race1))
    //get 2nd race
    .then((race2) => res.json(race2))
}

// //when api is fuked
// var Driver = { driver: 'driver' }
// function respond(req, res, next) {
//   res.json(Driver)
// }

//Server

var server = restify.createServer()
//1: response to going to website
server.get('/', respond)
server.head('/', respond)

server.listen(8080, function () {
  console.log('hello ..listening')
})
