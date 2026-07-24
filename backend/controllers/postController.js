import Post from '../models/postModel.js';
import Comment from '../models/commentModel.js';
import Bookmark from '../models/bookmarkModel.js';
import Notification from '../models/notificationModel.js';

// Helper function to extract hashtags from post content
const extractHashtags = (text) => {
  if (!text) return [];
  const matches = text.match(/#[\w]+/g);
  if (!matches) return [];
  return Array.from(new Set(matches.map((tag) => tag.substring(1).toLowerCase())));
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      res.status(400);
      throw new Error('Post content cannot be empty');
    }

    let imagePath = '';
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const hashtags = extractHashtags(content);

    const post = await Post.create({
      user: req.user._id,
      content: content.trim(),
      image: imagePath,
      hashtags,
    });

    const populatedPost = await Post.findById(post._id).populate(
      'user',
      'name username profilePic isOnline'
    );

    res.status(201).json({
      success: true,
      data: populatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all feed posts with pagination
// @route   GET /api/posts?page=1&limit=10&hashtag=tech
// @access  Private
export const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const hashtag = req.query.hashtag;

    let filter = {};
    if (hashtag) {
      filter.hashtags = hashtag.toLowerCase().trim();
    }

    const totalPosts = await Post.countDocuments(filter);

    const posts = await Post.find(filter)
      .populate('user', 'name username profilePic isOnline')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: posts.length,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
      hasMore: skip + posts.length < totalPosts,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Private
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'user',
      'name username profilePic isOnline'
    );

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get posts by specific user
// @route   GET /api/posts/user/:userId
// @access  Private
export const getPostsByUser = async (req, res, next) => {
  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate('user', 'name username profilePic isOnline')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like / Unlike post
// @route   POST /api/posts/:id/like
// @access  Private
export const likeUnlikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    const userId = req.user._id;
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // Unlike post
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
      await post.save();

      res.status(200).json({
        success: true,
        message: 'Post unliked',
        likesCount: post.likes.length,
        isLiked: false,
      });
    } else {
      // Like post
      post.likes.push(userId);
      await post.save();

      // Create notification if not liking own post
      if (post.user.toString() !== userId.toString()) {
        await Notification.create({
          recipient: post.user,
          sender: userId,
          type: 'like',
          post: post._id,
        });
      }

      res.status(200).json({
        success: true,
        message: 'Post liked',
        likesCount: post.likes.length,
        isLiked: true,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    // Authorization check
    if (post.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('You can only delete your own posts');
    }

    // Delete post & associated comments and bookmarks
    await Post.findByIdAndDelete(req.params.id);
    await Comment.deleteMany({ post: req.params.id });
    await Bookmark.deleteMany({ post: req.params.id });
    await Notification.deleteMany({ post: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trending hashtags
// @route   GET /api/posts/hashtags/trending
// @access  Private
export const getTrendingHashtags = async (req, res, next) => {
  try {
    const trending = await Post.aggregate([
      { $unwind: '$hashtags' },
      { $group: { _id: '$hashtags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    res.status(200).json({
      success: true,
      data: trending,
    });
  } catch (error) {
    next(error);
  }
};
