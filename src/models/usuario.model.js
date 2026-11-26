const db = require("../db/bd")

const tabela = "`usuario`"
const chave = "`id`"
const camposPermitidos = ["nome", "email", "senha"]

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

async function login(dados) {
    if (!dados) {
        return {
            status: 400,
            mensagem: 'Insira os dados.'
        }
    }

    try {
        const sql = `SELECT * FROM usuario WHERE email = '${dados.email}' AND senha = password('${dados.senha}')`

        const [result] = await db.query(sql)

        if (result[0]) {
            return {
                status: 200,
                mensagem: "Login realizado com sucesso."
            }
        } else {
            return {
                status: 404,
                mensagem: "Usuário não encontrado."
            }
        }
    } catch (err) {
        console.log(err)
        return {
            status: 500,
            mensagem: "Erro interno."
        }
    }
}

module.exports = { listar, criar, atualizar, excluir, login }
