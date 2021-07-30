const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes ,nextISSTimesForMyLocation } = require('./iss_promised');

fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then(body => console.log(body));

  const printResultingData = ((resultingData) => {
    for (const data of resultingData) {
      const datetime = new Date(0);
      datetime.setUTCSeconds(data.risetime);
      const duration = data.duration;
      console.log(`Next pass at ${datetime} for ${duration} seconds!`)
    }
  })

  nextISSTimesForMyLocation()
  .then((resultingData) => {
    printResultingData(resultingData);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });