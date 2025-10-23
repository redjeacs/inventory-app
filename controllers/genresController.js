const db = require("../db/queries");
const { validationResult, body, matchedData } = require("express-validator");

const validateGenre = [body("genre").trim().isAlphanumeric().withMessage("")];

exports.getGenres = (req, res) => {
  res.render("genres", { title: "Gamestop Genres" });
};

exports.genreCreateGet = async (req, res) => {
  res.render("newGenre");
};
