const { Router } = require("express");
const genresController = require("../controllers/genresController");
const genresRouter = Router();

genresRouter.get("/", genresController.getGenres);
genresRouter.get("/new", genresController.genreCreateGet);
genresRouter.post("/new", genresController.genreCreatePost);

module.exports = genresRouter;
