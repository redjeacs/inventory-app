const CustomNotFoundError = require("../errors/CustomNotFoundError");
const pool = require("./pool");

exports.getGames = async () => {
  const result = await pool.query("SELECT * FROM inventory");
  return result.rows;
};

exports.getGameById = async (gameId) => {
  const result = await pool.query(
    `SELECT * FROM inventory WHERE id = ${gameId}`
  );
  return result.rows[0];
};

async function getGenreIdByName(genre) {
  const result = await pool.query("SELECT id FROM genres WHERE genre = $1", [
    genre,
  ]);
  return result.rows[0].id;
}

exports.createGame = async (gameDetails) => {
  const genreId = await getGenreIdByName(gameDetails.genre);
  if (!genreId) throw CustomNotFoundError("Invalid genre");
  await pool.query(
    "INSERT INTO inventory (game, genre_id, release_date, price, img_src, description) VALUES ($1, $2, $3, $4, $5, $6)",
    [
      gameDetails.game,
      genreId,
      gameDetails.release_date,
      gameDetails.price,
      gameDetails.img_src,
      gameDetails.description,
    ]
  );
};

exports.updateGame = async (gameId) => {
  await pool.query("");
};

exports.deleteGame = async (gameId) => {
  await pool.query(`DELETE FROM inventory WHERE id = ${gameId}`);
};

exports.getGenres = async () => {
  const result = await pool.query("SELECT * FROM genres");
  return result.rows;
};

exports.getGenreById = async (genreId) => {
  const result = await pool.query(`SELECT * FROM genres WHERE id = ${genreId}`);
  return result.rows[0];
};

exports.createGenre = async (genreDetails) => {
  await pool.query("INSERT INTO genres (genre) VALUES ($1)", [
    genreDetails.genre,
  ]);
};

exports.updateGenre = async (genreId) => {
  await pool.query("");
};

exports.deleteGenre = async (genreId) => {
  await pool.query(`DELETE FROM genres WHERE id = ${genreId}`);
};
