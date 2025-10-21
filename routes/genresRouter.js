const { Router } = require("express");

const genresRouter = Router();

genresRouter.get("/", (req, res) => {
  res.render("genres", { title: "Gamestop Genres" });
});

module.exports = genresRouter;
