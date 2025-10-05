const Joi = require('joi');

const FilmeSchema = Joi.object({
  id: Joi.number().integer().optional(),
  titulo: Joi.string().required(),
  diretor: Joi.string().required(),
  ano: Joi.number().integer().min(1900).max(2025).required(),
  genero: Joi.string().required(),
  duracao_minutos: Joi.number().integer().positive().required(),
  nota_imdb: Joi.number().min(0).max(10).required(),
});

class Filme {
  constructor(titulo, diretor, ano, genero, duracao_minutos, nota_imdb) {
    this.id = undefined;
    this.titulo = titulo;
    this.diretor = diretor;
    this.ano = ano;
    this.genero = genero;
    this.duracao_minutos = duracao_minutos;
    this.nota_imdb = nota_imdb;
  }

  validate() {
    return FilmeSchema.validate(this, { abortEarly: false });
  }
}

module.exports = { Filme };