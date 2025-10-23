const db = require("../db/queries");
const { validationResult, body, matchedData } = require("express-validator");

const validateGame = [];

exports.getGames = async (req, res) => {
  const data = await db.getGames();
  res.render("games", { title: "GameWarehouse Games", games: data });
};

exports.getGameById = async (req, res) => {
  const gameId = parseInt(req.params.id);
  console.log(req.params.id);
  const data = await db.getGameById(gameId);
  res.render("game", { game: data });
};

exports.gameCreateGet = async (req, res) => {
  res.render("newGame");
};
