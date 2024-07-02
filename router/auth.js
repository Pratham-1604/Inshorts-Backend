const { login, register } = require("../controllers/auth");

const router = require("express").Router();


router.post("/signup" , register);
router.post("/login" , login);

module.exports = router;