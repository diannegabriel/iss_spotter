const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation } = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned IP:' , ip);
  return
});

fetchCoordsByIP('', (error, coordinates) => {
  if (error) {
    console.log("It didn't work", error)
    return
  }
  console.log('It worked! Returned coordinates:' , coordinates);
  return
});

const issCoords = { latitude: '-1.1977', longitude: '-151.4789' };

fetchISSFlyOverTimes(issCoords, (error, passTimes) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned flyover times:' , passTimes);
});

const printResultingData = ((resultingData) => {
  for (const data of resultingData) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(data.risetime);
    const duration = data.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`)
  }
})

nextISSTimesForMyLocation((error, resultingData) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printResultingData(resultingData)

})
