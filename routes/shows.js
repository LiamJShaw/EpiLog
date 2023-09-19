const express = require("express");
const router = express.Router();

const show_controller = require("../controllers/showController");

// GET request for list of all Show items.
router.get("/", show_controller.show_list);

// GET request for individual Show item.
router.get("/:id", show_controller.show_detail);

module.exports = router;