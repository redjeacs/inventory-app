const db = require("../db/queries");
const { validationResult, body, matchedData } = require("express-validator");
const CustomNotFoundError = require("../errors/CustomNotFoundError");

const validateGenre = [
  body("genre")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Genre name is required")
    .isAlphanumeric()
    .withMessage("Genre can only contain letters, spaces and hyphens"),
];

exports.getGenres = async (req, res) => {
  const data = await db.getGenres();
  res.render("genres", { title: "Gamestop Genres", genres: data });
};

exports.genreCreateGet = async (req, res) => {
  res.render("newGenre");
};

exports.genreCreatePost = [
  validateGenre,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).render("newGenre", { errors: errors.array() });
    }
    try {
      const data = matchedData(req);
      console.log(data);
      if (!data.genre)
        throw new CustomNotFoundError("Provided Genre is invalid!");
      await db.createGenre(data);
      res.redirect("/genres");
    } catch (error) {
      // Check for Postgres unique constraint violation
      if (error.code === "23505") {
        // Postgres unique violation code
        return res.status(400).render("newGenre", {
          errors: [{ msg: "This genre already exists" }],
        });
      }
      // Handle other errors
      console.error(error);
      return res.status(500).render("newGenre", {
        errors: [{ msg: "An error occurred while creating the genre" }],
      });
    }
  },
];
