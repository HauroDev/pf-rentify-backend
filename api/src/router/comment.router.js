const { Router } = require("express");

const { newComment } = require("../controller/comment");

const router = Router();

//metodos post
router.post("/comment", newComment);

module.exports = router;
