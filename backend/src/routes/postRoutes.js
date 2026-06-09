const express = require("express");

const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const protect = require("../middleware/authMiddleware");
const { toggleLike } = require("../controllers/postController");
const { addComment } = require("../controllers/postController");
const { createPost } = require("../controllers/postController");
const { fetchPosts } = require("../controllers/postController");

router.post("/create-posts", protect, upload.single("image"), createPost);
router.put("/:id/like", protect, toggleLike);
router.post("/:id/comments", protect, addComment);
router.get("/feed", fetchPosts);

module.exports = router;