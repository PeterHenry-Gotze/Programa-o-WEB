const { readFile, writeFile } = require('node:fs/promises');
const path = require('node:path');

const FILMES_FILE = path.join(__dirname, '..', 'data', 'filmes.json');
const DIRETORES_FILE = path.join(__dirname, '..', 'data', 'diretores.json');
const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

const getResourceFile = (resource) => {
  if (resource === 'filmes') return FILMES_FILE;
  if (resource === 'diretores') return DIRETORES_FILE;
  if (resource === 'users') return USERS_FILE;
  throw new Error('Recurso inválido');
};

const readData = async (resource) => {
  try {
    const file = getResourceFile(resource);
    const content = await readFile(file, { encoding: 'utf-8' });
    return JSON.parse(content);
  } catch (error) {
    // Se o arquivo não existir ou for inválido, retorna uma estrutura padrão
    if (resource === 'users') return [];
    return { nextId: 1, [resource]: [] };
  }
};

const writeData = async (resource, data) => {
  const file = getResourceFile(resource);
  await writeFile(file, JSON.stringify(data, null, 2), { encoding: 'utf-8' });
};

const getAll = async (resource) => {
  const data = await readData(resource);
  return data[resource];
};

const getById = async (resource, id) => {
  const items = await getAll(resource);
  return items.find((item) => item.id === id);
};

const insert = async (resource, newItem) => {
  const data = await readData(resource);
  const id = data.nextId;
  newItem.id = id;
  data[resource].push(newItem);
  data.nextId++;
  await writeData(resource, data);
  return newItem;
};

const update = async (resource, id, updatedItem) => {
  const data = await readData(resource);
  const index = data[resource].findIndex((item) => item.id === id);
  if (index === -1) {
    return null; // Indica que o item não foi encontrado
  }
  updatedItem.id = id; // Garante que o ID não seja alterado
  data[resource][index] = updatedItem;
  await writeData(resource, data);
  return updatedItem;
};

const remove = async (resource, id) => {
  const data = await readData(resource);
  const initialLength = data[resource].length;
  data[resource] = data[resource].filter((item) => item.id !== id);
  if (data[resource].length === initialLength) {
    return false; // Indica que nenhum item foi removido
  }
  await writeData(resource, data);
  return true;
};

const findUserByApiKey = async (apiKey) => {
    const users = await readData('users');
    return users.find(user => user.apiKey === apiKey);
};

module.exports = {
  getAll,
  getById,
  insert,
  update,
  remove,
  findUserByApiKey,
};