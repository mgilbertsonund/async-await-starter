const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../modules/pool');

router.get('/', async (req, res) => {
  console.log('in /api/pokemon GET');
  // Write a try-catch for calling getPokemon asynchronously
});

const getPokemon = async () => {
  console.log('in getPokemon()')
  // Write a try-catch for getting all the pokemon from db by Strength Index
};

router.post('/', async (req, res) => {
  console.log('in /api/pokemon POST')
  // Write a try-catch for getting all the pokemon from PokeAPI
});

const insertPokemon = async (pokemonData) => {
  console.log('in insertPokemon()')
  // Write the logic to insert into the database
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
