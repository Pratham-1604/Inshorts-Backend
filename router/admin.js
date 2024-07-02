const {
  addNote,
  getShortsFeed,
  upvoteNote,
  removeUpvoteNote,
  downvoteNote,
  removeDownvoteNote,
  getFilteredShorts,
} = require("../controllers/notes");

const router = require("express").Router();

router.post("/addNote", addNote);
router.get("/shorts/feed", getShortsFeed);
router.get("/shorts/feed/upvote/:id", upvoteNote);
router.get("/shorts/feed/removeUpvote/:id", removeUpvoteNote);
router.get("/shorts/feed/downvote/:id", downvoteNote);
router.get("/shorts/feed/removeDownvote/:id", removeDownvoteNote);
router.get("/shorts/filter", getFilteredShorts);

module.exports = router;
