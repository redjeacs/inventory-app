require("dotenv").config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS inventory (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, game VARCHAR(50) UNIQUE, genre_id INTEGER, release_date DATE, price DECIMAL(10, 2), img_src TEXT DEFAULT '/images/game-default.svg', description VARCHAR(200))
CREATE TABLE IF NOT EXISTS genres (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, genre VARCHAR(50) UNIQUE, )
INSERT INTO inventory (game, category_id)
`;

async function populate() {
  const client = new Client({
    connectionString: LOCAL_DATABASE_URL,
    ssl: {
      rejectUnauthorized: False,
    },
  });
  try {
    await client.connect();
    await client.query(SQL);
    console.log("Database populated successfully");
  } catch {
    console.error("Error populating database: ", err);
  } finally {
    await client.end();
  }
}

populate();
