const db = require("../db/bd")

const tabela = "`consumo`"
const chave = "`id`"
const camposPermitidos = ["usuarioId", "local", "equipamento", "consumoKwh", "mesReferencia", "status"]

async function executar(sql, valores = []) {
    const [resultado] = await db.query(sql, valores)
    return resultado
}

async function listar() {
    return executar("SELECT * FROM " + tabela)
}

async function criar(dados) {
    const campos = camposPermitidos.filter(campo => dados[campo] !== undefined)
    if (!campos.length) throw new Error("Informe ao menos um campo válido.")
    const colunas = campos.map(campo => "`" + campo + "`").join(", ")
    const valores = campos.map(() => "?").join(", ")
    const resultado = await executar(
        "INSERT INTO " + tabela + " (" + colunas + ") VALUES (" + valores + ")",
        campos.map(campo => dados[campo])
    )
    if (resultado.insertId) {
        const rows = await executar("SELECT * FROM " + tabela + " WHERE " + chave + " = ?", [resultado.insertId])
        return rows[0] || { id: resultado.insertId, mensagem: "Registro criado." }
    }
    return { mensagem: "Registro criado.", affectedRows: resultado.affectedRows }
}

async function atualizar(id, dados) {
    const campos = camposPermitidos.filter(campo => dados[campo] !== undefined)
    if (!campos.length) throw new Error("Informe ao menos um campo válido.")
    const set = campos.map(campo => "`" + campo + "` = ?").join(", ")
    const resultado = await executar(
        "UPDATE " + tabela + " SET " + set + " WHERE " + chave + " = ?",
        [...campos.map(campo => dados[campo]), id]
    )
    if (!resultado.affectedRows && !resultado.changedRows) return null
    const rows = await executar("SELECT * FROM " + tabela + " WHERE " + chave + " = ?", [id])
    return rows[0] || { mensagem: "Registro atualizado." }
}

async function excluir(id) {
    const resultado = await executar("DELETE FROM " + tabela + " WHERE " + chave + " = ?", [id])
    return resultado.affectedRows > 0
}

async function media() {
    try {
        const sql = `SELECT AVG(consumoKwh) AS mediaConsumo FROM consumo`

        const [result] = await db.query(sql)

        return {
            status: 200,
            mensagem: result
        }
    } catch (err) {
        console.log(err)
        return {
            status: 500,
            mensagem: 'Erro interno'
        }
    }
}

module.exports = { listar, criar, atualizar, excluir, media }
