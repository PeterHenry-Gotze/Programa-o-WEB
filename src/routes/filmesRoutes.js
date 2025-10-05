const express = require('express');
const DB = require('../database/database');
const { Filme } = require('../models/Filme');
const { errorResponse } = require('../utils/response');

const router = express.Router();

// GET /filmes - Listar todos os filmes
router.get('/', async (req, res) => {
  try {
    const filmes = await DB.getAll('filmes');
    res.status(200).json(filmes);
  } catch (error) {
    errorResponse(res, 500, 'Erro ao buscar a lista de filmes.');
  }
});

// GET /filmes/:id - Obter um filme específico
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const filme = await DB.getById('filmes', id);
    if (filme) {
      res.status(200).json(filme);
    } else {
      errorResponse(res, 404, 'Filme não encontrado.');
    }
  } catch (error) {
    errorResponse(res, 500, `Erro ao buscar o filme com ID ${id}.`);
  }
});

// POST /filmes - Cadastrar novo filme
router.post('/', async (req, res) => {
  const { titulo, diretor, ano, genero, duracao_minutos, nota_imdb } = req.body;
  const filme = new Filme(titulo, diretor, ano, genero, duracao_minutos, nota_imdb);
  const { error } = filme.validate();

  if (error) {
    const messages = error.details.map(d => d.message).join('; ');
    return errorResponse(res, 400, `Dados inválidos: ${messages}`);
  }

  try {
    const novoFilme = await DB.insert('filmes', filme);
    res.status(201).json(novoFilme);
  } catch (err) {
    errorResponse(res, 500, 'Erro ao cadastrar o filme.');
  }
});

// PUT /filmes/:id - Atualizar um filme
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { titulo, diretor, ano, genero, duracao_minutos, nota_imdb } = req.body;
  
  try {
    const filmeExistente = await DB.getById('filmes', id);
    if (!filmeExistente) {
      return errorResponse(res, 404, 'Filme não encontrado para atualização.');
    }

    const filmeAtualizado = new Filme(titulo, diretor, ano, genero, duracao_minutos, nota_imdb);
    const { error } = filmeAtualizado.validate();

    if (error) {
      const messages = error.details.map(d => d.message).join('; ');
      return errorResponse(res, 400, `Dados inválidos: ${messages}`);
    }

    const resultado = await DB.update('filmes', id, filmeAtualizado);
    res.status(200).json(resultado);
  } catch (err) {
    errorResponse(res, 500, 'Erro ao atualizar o filme.');
  }
});

// DELETE /filmes/:id - Remover um filme
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const sucesso = await DB.remove('filmes', id);
    if (sucesso) {
      res.status(200).json({ message: 'Filme removido com sucesso.' });
    } else {
      errorResponse(res, 404, 'Filme não encontrado para remoção.');
    }
  } catch (err) {
    errorResponse(res, 500, 'Erro ao remover o filme.');
  }
});

module.exports = router;