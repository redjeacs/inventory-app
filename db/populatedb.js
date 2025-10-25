require("dotenv").config();
const { Client } = require("pg");

const SQL = `
DROP TABLE IF EXISTS genres, inventory;

CREATE TABLE IF NOT EXISTS genres (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
  genre VARCHAR(50) UNIQUE
);

CREATE TABLE IF NOT EXISTS inventory (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, 
  game VARCHAR(50) UNIQUE, 
  genre_id INTEGER, 
  release_date DATE, 
  price DECIMAL(10, 2), 
  img_src TEXT DEFAULT '/assets/game-default.jpg', 
  description VARCHAR(200)
);


INSERT INTO genres (genre) VALUES 
  ('FPS'), 
  ('Puzzle'), 
  ('Turn-Based Strategy'), 
  ('Action Role-Playing'), 
  ('Sports');


INSERT INTO inventory (game, genre_id, release_date, price, img_src, description) VALUES
  ('Counter-Strike 2', 1, '2023-09-27', 0.00, '/assets/cs2.jpg', 'CS2, or Counter-Strike 2, is an online, first-person shooter game and the fifth official title in the main Counter-Strike series.'), 
  ('Escape Simulator', 2, '2021-10-19', 19.99, '/assets/escape-simulator.jpg', 'First-person puzzler you can play solo or in an online co-op. Explore a set of highly interactive escape rooms.'), 
  ('Baldur''s Gate 3', 3, '2023-08-03', 59.99, '/assets/bg3.jpg', 'Baldur''s Gate 3 is a story-rich, party-based RPG set in the universe of Dungeons & Dragons, where your choices shape a tale of fellowship and betrayal, survival and sacrifice.'), 
  ('Elden Ring', 4, '2022-02-25', 59.99, '/assets/elden-ring.jpg', 'THE CRITICALLY ACCLAIMED FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.'), 
  ('Rematch', 5, '2025-06-19', 29.99, '/assets/rematch.jpg', 'Control one player on your team and compete in fast-paced 5v5 matches from an immersive third-person perspective. Team up with your friends and join the action.');
`;

async function populate() {
  const client = new Client({
    connectionString: process.env.LOCAL_DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  try {
    await client.connect();
    await client.query(SQL);
    console.log("Database populated successfully");
  } catch (err) {
    console.error("Error populating database:", err);
  } finally {
    await client.end();
    console.log("done");
  }
}

populate();
