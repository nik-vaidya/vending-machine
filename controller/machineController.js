
const express = require('express')
const router = express.Router()

const inventory = require('../inventory/stock')
const machine = require('../machines/machine')

router.post('/inventory/fill/stock', inventory.fillUpStock)
router.get('/inventory/get/stock', inventory.getStock)

router.post('/collectCash', machine.collectCash)
router.post('/cancel', machine.cancel)
router.post('/dispenseitem', machine.dispenseItem)

module.exports = router