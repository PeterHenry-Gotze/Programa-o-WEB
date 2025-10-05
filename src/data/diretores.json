const Joi = require('joi');

const DiretorSchema = Joi.object({
  id: Joi.number().integer().optional(),
  nome: Joi.string().required(),
  pais_origem: Joi.string().required(),
  ano_nascimento: Joi.number().integer().min(1900).max(2020).required(),
  quantidade_filmes: Joi.number().integer().min(0).required(),
});

class Diretor {
  constructor(nome, pais_origem, ano_nascimento, quantidade_filmes) {
    this.id = undefined;
    this.nome = nome;
    this.pais_origem = pais_origem;
    this.ano_nascimento = ano_nascimento;
    this.quantidade_filmes = quantidade_filmes;
  }

  validate() {
    return DiretorSchema.validate(this, { abortEarly: false });
  }
}

module.exports = { Diretor };