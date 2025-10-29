const CustomNotFoundError = require("../errors/CustomNotFoundError");
const pool = require("./pool");

const filterGames = async (query) => {
  let sortQuerySQL = "";
  if (query.sort && query.sort.length > 0) {
    const [column, direction] = query.sort
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .toLowerCase()
      .split(" ");

    sortQuerySQL = `ORDER BY ${column} ${direction}`;
  }
  let genreQuerySQL = "";
  if (query.genre && query.genre.length > 0) {
    genreQuerySQL = `WHERE genre IN ('${query.genre}')`;
  }

  return `${genreQuerySQL} ${sortQuerySQL}`;
};

exports.getGames = async (query = null) => {
  let queries = "";
  if (query) {
    queries = await filterGames(query);
  }

  const result = await pool.query(
    `SELECT inventory.* FROM inventory JOIN genres ON genre_id = genres.id ${queries}`
  );
  return result.rows;
};

exports.getGameById = async (gameId) => {
  const result = await pool.query(
    `SELECT * FROM inventory i 
      JOIN genres g ON genre_id = g.id 
      WHERE i.id = ${gameId}`
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

exports.updateGame = async (gameDetails, id) => {
  const genreId = await getGenreIdByName(gameDetails.genre);

  await pool.query(
    `UPDATE inventory SET 
    game = $1, 
    genre_id = $2, 
    release_date = $3, 
    price = $4, 
    img_src = $5, 
    description = $6
    WHERE id = ${id}
    `,
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
  let index = [];
  const gamesInGenre = await pool.query(
    `SELECT inventory.id FROM inventory JOIN genres ON genre_id = genres.id WHERE genre_id = ${genreId}`
  );

  const gamesId = gamesInGenre.rows.map((game) => game.id);

  for (let i = 1; i <= gamesInGenre.rows.length; i++) {
    index.push(`$${i}`);
  }

  const indexString = index.join(", ");

  await pool.query(
    `DELETE FROM inventory WHERE id IN (${indexString})`,
    gamesId
  );
  await pool.query(`DELETE FROM genres WHERE id = ${genreId}`);
};
