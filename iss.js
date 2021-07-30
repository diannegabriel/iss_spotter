const request = require('request');

/**
* Makes a single API request to retrieve the user's IP address.
* Input:
*   - A callback (to pass back an error or the IP string)
* Returns (via Callback):
*   - An error, if any (nullable)
*   - The IP address as a string (null if error). Example: "162.245.144.188"
*
*/

const fetchMyIP = (callback) => {

  request('https://api.ipify.org/?format=json', 'utf8', (error, response, body) => {
    const ipAddress = JSON.parse(body);
    // console.log(ipAddress.ip) // shows IP address
    if (error) {
      callback(Error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    callback(null, ipAddress.ip);
  });
};


const fetchCoordsByIP = ((ip, callback) => {
  request('https://freegeoip.app/json/' + ip, 'utf8', (error, response, body) => {
    
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code: ${response.statusCode} when fetching coordinates. Response ${body}`;
      callback(Error(msg), null);
      return;
    }    
    const myCoordinates = {};
    myCoordinates.latitude = JSON.parse(body).latitude;
    myCoordinates.longitude = JSON.parse(body).longitude;
    callback(null, myCoordinates);
    
  });
});

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(url, "utf8", (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code: ${response.statusCode} when fetching ISS fly over time. Response ${body}`;
      callback(Error(msg), null);
      return;
    }
    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = ((callback) => {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP(ip, (error, coordinates) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(coordinates, (error, passes) => {
        if (error) {
          return callback(error, null)
        }
        callback(null, passes)
      })
    })
  })

})

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation};