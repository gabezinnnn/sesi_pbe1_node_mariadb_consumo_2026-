const express = require("express")
const controller = require("../controllers/consumo.controller")
const router = express.Router()

router.get("/", controller.listar)
router.get("/media", controller.media)
router.post("/", controller.criar)
router.put("/:id", controller.atualizar)
router.delete("/:id", controller.excluir)

module.exports = router
