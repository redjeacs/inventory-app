const { Router } = require("express");
const gamesController = require("../controllers/gamesController");
const gamesRouter = Router();

gamesRouter.get("/", gamesController.getGames);
gamesRouter.get("/new", gamesController.gameCreateGet);
gamesRouter.post("/new", gamesController.gameCreatePost);

gamesRouter.get("/:id", gamesController.getGameById);

gamesRouter.get("/edit/:id", gamesController.gameEditGet);

gamesRouter.post("/edit/:id", gamesController.gameEditPost);
gamesRouter.post("/delete/:id", gamesController.gameDelete);

module.exports = gamesRouter;
