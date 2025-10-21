const { Router } = require("express");

const genresRouter = Router();

genresRouter.get("/", (req, res) => {
  res.render("genres");
});

module.exports = genresRouter;
