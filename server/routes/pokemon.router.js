const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../modules/pool');

router.get('/', async (req, res) => {
  console.log('in /api/pokemon GET');
  // Write a try-catch for calling getPokemon asynchronously
  try {
    const pokemon = await getPokemon();
    res.json(pokemon);
  } catch (error) {
    console.error('Error fetching all Pokémon:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const getPokemon = async () => {
  console.log('in getPokemon()')
  // Write a try-catch for getting all the pokemon from db by Strength Index
  const client = await pool.connect(); // Begin
  try {
    const query = 'SELECT * FROM pokemon ORDER BY strength_index DESC';
    const result = await client.query(query);
    return result.rows;
  } catch (error) {
    console.error('Error fetching all Pokémon:', error);
    throw error;
  } finally {
    client.release();
  }
};

router.post('/', async (req, res) => {
  console.log('in /api/pokemon POST')
  // Write a try-catch for getting all the pokemon from PokeAPI
  const randomOffset = Math.floor(Math.random() * 960) + 1;

  try {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?offset=${randomOffset}&limit=3`
    );
    const pokemonList = response.data.results;
    const pokemonData = await Promise.all(
      pokemonList.map(async (pokemon) => {
        const pokemonResponse = await axios.get(pokemon.url);
        return pokemonResponse.data;
      })
    );

    await insertPokemon(pokemonData);

    const allPokemon = await getPokemon();

    res.json(allPokemon);
  } catch (error) {
    console.error('Error fetching Pokémon:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const insertPokemon = async (pokemonData) => {
  console.log('in insertPokemon()')
  // Write the logic to insert into the database
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const query = `
      INSERT INTO pokemon (name, height, weight, strength_index, image_url)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (name) DO NOTHING
    `;

    for (const pokemon of pokemonData) {
      const strengthIndex = calculateStrengthIndex(pokemon.stats);
      await client.query(query, [
        pokemon.name,
        pokemon.height,
        pokemon.weight,
        strengthIndex,
        pokemon.sprites.front_default,
      ]);
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error inserting Pokémon:', error);
    throw error;
  } finally {
    client.release();
  }
};

const calculateStrengthIndex = (stats) => {
  console.log('in calculateStrengthIndex()')
  const attackStat =
    stats.find((stat) => stat.stat.name === 'attack')?.base_stat || 0;
  const defenseStat =
    stats.find((stat) => stat.stat.name === 'defense')?.base_stat || 0;
  const hpStat = stats.find((stat) => stat.stat.name === 'hp')?.base_stat || 0;
  const strengthIndex = attackStat + defenseStat + hpStat;
  return strengthIndex;
};

module.exports = router;