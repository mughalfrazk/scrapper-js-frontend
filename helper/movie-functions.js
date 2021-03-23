const db = require("../models/db");

const addToArray = (name, index, value) => {
  arrays[name][index] = value;
};

const getCinemaIDs = (data) => {
  var cinemas = [],
    output = [],
    l = data.length,
    i;
  for (i = 0; i < l; i++) {
    if (cinemas[data[i].c_id]) continue;
    cinemas[data[i].c_id] = true;
    output.push(data[i].c_id);
  }
  return output;
};

const getDistinctPackages = (data) => {
  var packages = [],
    output = [],
    l = data.length,
    i;
  for (i = 0; i < l; i++) {
    if (packages[data[i].seatName]) continue;
    packages[data[i].seatName] = true;
    output.push(data[i].seatName);
  }
  return output;
};

const splitCinemaDatatoPackages = (movieCinemaData) => {
  let cinemaObj = {};
  distPackages = getDistinctPackages(movieCinemaData);
  let arr = [];
  for (let i = 0; i < distPackages.length; i++) {
    let packages = [];
    cinemaObj["cinema_id"] = movieCinemaData[0].c_id;
    cinemaObj["cinema_name"] = movieCinemaData[0].c_name;
    movieCinemaData.map((package) => {
      if (package.seatName == distPackages[i]) {
        packages.push(package);
      }
    });

    // packages.push({
    //   p_id: movieCinemaData[i].p_id,
    //   seat: movieCinemaData[i].seatName,
    //   price: movieCinemaData[i].price,
    //   availability: movieCinemaData[i].availability,
    // });

    arr[i] = packages;
  }
  cinemaObj["packages"] = arr;
  return cinemaObj;
};

const splitMovieDatatoCinemas = (cIDs, movieData) => {
  // console.log(cIDs, " ", movieData.length);
  let movie_cinemas = [];
  for (let i = 0; i < cIDs.length; i++) {
    let cinema_arr = [];
    movieData.map((cinema) => {
      if (cinema.c_id == cIDs[i]) {
        cinema_arr.push(cinema);
      }
    });
    //movie_cinemas[i] = cinema_arr;
    movie_cinemas[i] = splitCinemaDatatoPackages(cinema_arr);
  }
  return movie_cinemas;
};

exports.getCinemaIDs = getCinemaIDs;
exports.splitMovieDatatoCinemas = splitMovieDatatoCinemas;
