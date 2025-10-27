const db = require("../db/queries");
const CustomNotFoundError = require("../errors/CustomNotFoundError");
const { validationResult, body, matchedData } = require("express-validator");

const validateGame = [
  body("game")
    .trim()
    .isAlphanumeric()
    .withMessage("Game title is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("game title cannot exceed 50 characters"),
  body("genre").trim().exists().withMessage("Genre selection is required"),
  body("release_date")
    .isDate()
    .withMessage("Release date is required")
    .isBefore(new Date().toISOString().slice(0, 10))
    .withMessage("Release date must be before Today"),
  body("price")
    .trim()
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number")
    .matches(/^\d+(\.\d{2})?$/)
    .withMessage("Price must have exactly two decimal places or be an integer"),
  body("img_src").trim(),
  body("description")
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description cannot exceed 200 characters"),
];

exports.getGames = async (req, res) => {
  const data = await db.getGames();
  res.render("games", { title: "GameWarehouse Games", games: data });
};

exports.getGameById = async (req, res) => {
  const gameId = parseInt(req.params.id);
  const data = await db.getGameById(gameId);
  res.render("game", { data: data });
};

exports.gameCreateGet = async (req, res) => {
  const genres = await db.getGenres();
  res.render("newGame", { genres: genres });
};

exports.gameCreatePost = [
  validateGame,
  async (req, res) => {
    const genres = await db.getGenres();
    const formData = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("newGame", {
        genres: genres,
        errors: errors.array(),
        formData: formData,
      });
    }
    try {
      const data = matchedData(req);
      if (!data)
        throw new CustomNotFoundError("Provided Game Details is invalid!");
      if (!data.img_src || data.img_src.trim() === "") {
        data.img_src = "/assets/game-default.jpg";
      }
      await db.createGame(data);
      res.redirect("/games");
    } catch (error) {
      // Check for Postgres unique constraint violation
      if (error.code === "23505") {
        // Postgres unique violation code
        return res.status(400).render("newGame", {
          genres: genres,
          errors: [{ msg: "This game already exists" }],
          formData: formData,
        });
      }
      // Handle other errors
      console.error(error);
      return res.status(500).render("newGame", {
        genres: genres,
        errors: [
          {
            msg: "An error occurred while creating the game",
            formData: formData,
          },
        ],
      });
    }
  },
];

exports.gameDelete = async (req, res) => {
  const gameId = req.params.id;
  console.log(gameId);
  await db.deleteGame(gameId);
  res.redirect("/games");
};
