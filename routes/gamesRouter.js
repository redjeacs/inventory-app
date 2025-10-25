const { Router } = require("express");
const gamesController = require("../controllers/gamesController");
const gamesRouter = Router();

gamesRouter.get("/", gamesController.getGames);
gamesRouter.get("/new", gamesController.gameCreateGet);

gamesRouter.get("/:id", gamesController.getGameById);

module.exports = gamesRouter;
