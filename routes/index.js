var express = require('express');
var router = express.Router();

const show_controller = require("../controllers/showController");

/* GET home page. */
router.get("/", show_controller.index);

module.exports = router;
