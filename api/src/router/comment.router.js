const { Router } = require("express");

const { newComment } = require("../controller/comment");

const router = Router();

//metodos post
router.post("/", newComment);

module.exports = router;
