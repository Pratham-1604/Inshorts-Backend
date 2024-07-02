const { createAdminUser, getApiKey } = require("../controllers/auth");
const {
  addNote,
  verifyApiKey,
} = require("../controllers/notes");

const router = require("express").Router();

router.post("/createAdmin", createAdminUser);
router.post("/get-api-key", getApiKey);
router.post("/addNote", verifyApiKey, addNote);


module.exports = router;
