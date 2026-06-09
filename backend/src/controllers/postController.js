const Post = require("../models/Post");
const imagekit = require("../config/imagekit");

const createPost = async (req, res) => {
  try {
    const { caption } = req.body;

    let imageUrl = "";

    if (req.file) {
      const uploadedImage = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
      });

      imageUrl = uploadedImage.url;
    }

    if (!caption && !imageUrl) {
      return res.status(400).json({
        message: "Caption or image is required",
      });
    }

    const post = await Post.create({
      user: req.user.id,
      caption,
      imageUrl,
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


const toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();

    res.status(200).json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likesCount: post.likes.length,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    post.comments.push({
      user: userId,
      text: text,
    });

    await post.save();

    res.status(200).json({
      message: "Comment added",
      commentsCount: post.comments.length,
      comments: post.comments,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const fetchPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "username")
            .populate("comments.user", "username")
            .sort({ createdAt: -1 });


        res.status(200).json({
            message: "Posts fetched successfully",
            posts,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }               

};

module.exports = {
  createPost,
  toggleLike,
  addComment,
  fetchPosts,
};
