const express = require('express');
const DB = require('../database/database');
const { Diretor } = require('../models/Diretor');
const { errorResponse } = require('../utils/response');

const router = express.Router();

// GET /diretores - Listar todos os diretores
router.get('/', async (req, res) => {
  try {
    const diretores = await DB.getAll('diretores');
    res.status(200).json(diretores);
  } catch (error) {
    errorResponse(res, 500, 'Erro ao buscar a lista de diretores.');
  }
});

// GET /diretores/:id - Obter um diretor específico
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const diretor = await DB.getById('diretores', id);
    if (diretor) {
      res.status(200).json(diretor);
    } else {
      errorResponse(res, 404, 'Diretor não encontrado.');
    }
  } catch (error) {
    errorResponse(res, 500, `Erro ao buscar o diretor com ID ${id}.`);
  }
});

// POST /diretores - Cadastrar novo diretor
router.post('/', async (req, res) => {
  const { nome, pais_origem, ano_nascimento, quantidade_filmes } = req.body;
  const diretor = new Diretor(nome, pais_origem, ano_nascimento, quantidade_filmes);
  const { error } = diretor.validate();

  if (error) {
    const messages = error.details.map(d => d.message).join('; ');
    return errorResponse(res, 400, `Dados inválidos: ${messages}`);
  }

  try {
    const novoDiretor = await DB.insert('diretores', diretor);
    res.status(201).json(novoDiretor);
  } catch (err) {
    errorResponse(res, 500, 'Erro ao cadastrar o diretor.');
  }
});

// PUT /diretores/:id - Atualizar um diretor
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, pais_origem, ano_nascimento, quantidade_filmes } = req.body;
  
  try {
    const diretorExistente = await DB.getById('diretores', id);
    if (!diretorExistente) {
      return errorResponse(res, 404, 'Diretor não encontrado para atualização.');
    }

    const diretorAtualizado = new Diretor(nome, pais_origem, ano_nascimento, quantidade_filmes);
    const { error } = diretorAtualizado.validate();

    if (error) {
      const messages = error.details.map(d => d.message).join('; ');
      return errorResponse(res, 400, `Dados inválidos: ${messages}`);
    }

    const resultado = await DB.update('diretores', id, diretorAtualizado);
    res.status(200).json(resultado);
  } catch (err) {
    errorResponse(res, 500, 'Erro ao atualizar o diretor.');
  }
});

// DELETE /diretores/:id - Remover um diretor
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const sucesso = await DB.remove('diretores', id);
    if (sucesso) {
      res.status(200).json({ message: 'Diretor removido com sucesso.' });
    } else {
      errorResponse(res, 404, 'Diretor não encontrado para remoção.');
    }
  } catch (err) {
    errorResponse(res, 500, 'Erro ao remover o diretor.');
  }
});

module.exports = router;