const express = require("express")
const controller = require("../controllers/usuario.controller")
const router = express.Router()

router.get("/", controller.listar)
router.get("/login", controller.login)
router.post("/", controller.criar)
router.put("/:id", controller.atualizar)
router.delete("/:id", controller.excluir)

module.exports = router
