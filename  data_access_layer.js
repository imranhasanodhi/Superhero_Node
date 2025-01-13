const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Hasan_Imran_superheroes.json');

const readData = () => {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const getAll = () => readData();

const getOne = (id) => readData().find((hero) => hero.heroID === id);

const insert = (hero) => {
  const data = readData();
  data.push(hero);
  writeData(data);
  return hero;
};

const remove = (id) => {
  const data = readData();
  const updatedData = data.filter((hero) => hero.heroID !== id);
  writeData(updatedData);
  return id;
};

module.exports = { getAll, getOne, insert, remove };
