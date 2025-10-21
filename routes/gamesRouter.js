const { Router } = require("express");

const gamesRouter = Router();

gamesRouter.get("/", (req, res) => {
  res.render("games");
});

module.exports = gamesRouter;
