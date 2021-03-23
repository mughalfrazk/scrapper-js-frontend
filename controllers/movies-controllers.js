const express = require("express");
const db = require("../models/db");
const router = express.Router();

const {
  getCinemaIDs,
  splitMovieDatatoCinemas,
} = require("../helper/movie-functions");

router.get("/:movies_length/movies", (req, res, next) => {
  const movies_length = req.params.movies_length;
  let movies_list;
  const msquery = "SELECT * FROM movies;";
  db.query(msquery, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const number_of_movies = parseInt(movies_length);

      if (number_of_movies < 12) {
        movies_list = `<div class="col-lg-4 col-md-6 portfolio-item filter-card">
            <a onclick='movieClicked(${data[0].id})'>
                <img
                src="${data[0].imgUrl}"
                class="img-fluid"
                alt=""
                />
                <div class="portfolio-info">
                <h4>${data[0].name}</h4>
                <p>${data[0].movieCode}</p>
                </div>
            </a>
        </div>`;

        for (let i = 1; i < number_of_movies; i++) {
          movies_list += `<div class="col-lg-4 col-md-6 portfolio-item filter-card">
            <a onclick='movieClicked(${data[i].id})'>
                <img
                src="${data[i].imgUrl}"
                class="img-fluid"
                alt=""
                />
                <div class="portfolio-info">
                <h4>${data[i].name}</h4>
                <p>${data[i].movieCode}</p>
                </div>
            </a>
        </div>`;
        }
      } else {
        movies_list = `<div class="col-lg-2 col-md-3 portfolio-item filter-card" style="height: 300px">
            <a onclick='movieClicked(${data[0].id})'>
                <img
                src="${data[0].imgUrl}"
                style="height: 260px"
                class="img-fluid"
                alt=""
                />
                <div class="portfolio-info">
                <h4>${data[0].name}</h4>
                <p>${data[0].movieCode}</p>
                </div>
            </a>
        </div>`;

        for (let i = 1; i < data.length; i++) {
          movies_list += `<div class="col-lg-2 col-md-3 portfolio-item filter-card">
            <a onclick='movieClicked(${data[i].id})'>
                <img
                src="${data[i].imgUrl}"
                style="height: 260px"
                class="img-fluid"
                alt=""
                />
                <div class="portfolio-info">
                <h4>${data[i].name}</h4>
                <p>${data[i].movieCode}</p>
                </div>
            </a>
        </div>`;
        }
      }
      res.send(movies_list);
    }
  });
});

router.get("/movie/:movie_id", (req, res, next) => {
  const movie_id = req.params.movie_id;
  const msquery = `SELECT * FROM movies WHERE movies.id = ${movie_id};`;
  db.query(msquery, (err, movie_info) => {
    if (err) {
      console.log(err);
    } else {
      const selected_movie = `              
          <div class="col-md-5 text-right" id="mainPoster">
              <img
              class="main-movie-poster"
              src="${movie_info[0].imgUrl}"
              alt="Movie Poster"
              />
          </div>
          <div class="col-md-7 text-left pl-5">
            <h1 class="text-capitalize">${movie_info[0].name}</h1>
            <h2>${movie_info[0].movieCode}</h2>
          </div>`;
      res.writeHead(200, {
        "Content-Type": "text/html",
      });
      res.write(selected_movie);
      res.end();
    }
  });
});

router.get("/movie/detail/:movie_id", (req, res, next) => {
  const movie_id = req.params.movie_id;
  let cinemasInfo = [" "];
  const msquery = `SELECT movies.name, cinemas.id AS c_id, cinemas.name AS c_name, movies.id AS m_id, packages.id AS p_id, time.timing, packages.seatName, packages.price, packages.availability 
  FROM movies, cinemas, time, packages
  WHERE cinemas.id = time.cinemaId AND movies.id = time.movieId AND packages.timeId = time.id AND movies.id = ${movie_id} ORDER BY cinemas.id ASC`;
  db.query(msquery, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (!data.length) {
        cinemasInfo = `<div class="bg-light text-center border p-5 my-3">
          <h3 class="m-0">No Record Found!</h3>
        </div>`;

        res.json(cinemasInfo);
        return;
      }

      cinemaIDs = getCinemaIDs(data);
      movie_cinemas = splitMovieDatatoCinemas(cinemaIDs, data);

      for (let i = 0; i < movie_cinemas.length; i++) {
        cinemasInfo += `<div class="border-bottom py-5 px-5">
        <h4
          class="text-center text-uppercase font-weight-bold text-dark"
          style="letter-spacing: 1px"
        >
          ${movie_cinemas && movie_cinemas[i] && movie_cinemas[i].cinema_name}
        </h4>
          ${
            movie_cinemas &&
            movie_cinemas[i] &&
            movie_cinemas[i].packages.map(
              (
                package,
                index
              ) => `</p><div class="d-flex align-items-center pb-3 w-100">
                <h5 class="m-0 pr-3">
                    <small class="font-weight-bold" style="letter-spacing: 1px">${
                      package[0].seatName
                    }</small>
                </h5>
                    ${package.map(
                      (time, index) =>
                        `</p><p class="btn btn-outline-${
                          time.availability == "Available"
                            ? "primary"
                            : "danger"
                        } px-4 m-0 mr-3"
                        style="border-radius: 2rem" data-toggle="tooltip" data-placement="top" title='${
                          time.availability
                        }'>
                        ${time.timing} / ₹ ${time.price}
                      </p><p class="d-none">`
                    )}
              </div><p class="d-none">`
            )
          }
        </div>`;
      }

      res.json(cinemasInfo);
    }
  });
});

module.exports = router;

