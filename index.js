const express = require("express");

const server = express();
server.use(express.json());

let projects = [];

const incrementaContagemRequisicoes = (req, res, next) => {
  console.count(`Url: ${req.url} - Method: ${req.method} - chamadas api`);
  return next();
};

server.use(incrementaContagemRequisicoes);
const validosProjeto = (req, res, next) => {
  const { id, title } = req.body;
  if (!id || !title) return res.status(400).send("Insira o id e o titulo");
  return next();
};

const projetoExiste = (req, res, next) => {
  req.projectIndex = projects.findIndex(p => p.id == req.params.id);
  if (req.projectIndex == -1)
    return res.status(400).send("Informe um projeto real");
  return next();
};

server.post("/projects", validosProjeto, (req, res) => {
  projects.push(req.body);
  return res.json(projects);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", projetoExiste, validosProjeto, (req, res) => {
  let project = projects[req.projectIndex];
  project.title = req.body.title;
  res.json(project);
});

server.delete("/projects/:id", projetoExiste, (req, res) => {
  projects.splice(req.projectIndex, 1);
  res.send("Projeto Deletado");
});

server.post("/projects/:id/tasks", projetoExiste, (req, res) => {
  let project = projects[req.projectIndex];
  let { title } = req.body;
  project.tasks.push(title);
  return res.json(project);
});

server.listen(3000);
