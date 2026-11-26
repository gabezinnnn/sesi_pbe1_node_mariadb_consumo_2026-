const model = require("../models/usuario.model")

async function listar(req, res) {
    try { res.json(await model.listar()) }
    catch (erro) { res.status(500).json({ erro: "Erro ao listar registros.", detalhe: erro.message }) }
}

async function criar(req, res) {
    try { res.status(201).json(await model.criar(req.body || {})) }
    catch (erro) { res.status(400).json({ erro: "Não foi possível criar o registro.", detalhe: erro.message }) }
}

async function atualizar(req, res) {
    try {
        const registro = await model.atualizar(req.params.id, req.body || {})
        if (!registro) return res.status(404).json({ erro: "Registro não encontrado." })
        res.json(registro)
    } catch (erro) { res.status(400).json({ erro: "Não foi possível atualizar o registro.", detalhe: erro.message }) }
}

async function excluir(req, res) {
    try {
        const excluido = await model.excluir(req.params.id)
        if (!excluido) return res.status(404).json({ erro: "Registro não encontrado." })
        res.status(204).send()
    } catch (erro) { res.status(500).json({ erro: "Erro ao excluir registro.", detalhe: erro.message }) }
}

async function login(req, res) {
    const resp = await model.login(req.body)
    res.status(resp.status).send(resp.mensagem)
}

module.exports = { listar, criar, atualizar, excluir, login }
