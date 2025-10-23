const db = require("../db/queries");
const { validationResult, body, matchedData } = require("express-validator");

const validateGenre = [body("genre").trim().isAlphanumeric().withMessage("")];

exports.getGenres = async (req, res) => {
  const data = await db.getGenres();
  res.render("genres", { title: "Gamestop Genres", genres: data });
};

exports.genreCreateGet = async (req, res) => {
  res.render("newGenre");
};
