import Bookmark from '../models/bookmarkModel.js';
import Post from '../models/postModel.js';

// @desc    Toggle save/bookmark post
// @route   POST /api/bookmarks/:postId
// @access  Private
export const toggleBookmark = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    const existingBookmark = await Bookmark.findOne({ user: userId, post: postId });

    if (existingBookmark) {
      await Bookmark.findByIdAndDelete(existingBookmark._id);
      res.status(200).json({
        success: true,
        message: 'Post removed from bookmarks',
        isBookmarked: false,
      });
    } else {
      await Bookmark.create({ user: userId, post: postId });
      res.status(201).json({
        success: true,
        message: 'Post saved to bookmarks',
        isBookmarked: true,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's bookmarked posts
// @route   GET /api/bookmarks
// @access  Private
export const getSavedPosts = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate({
        path: 'post',
        populate: {
          path: 'user',
          select: 'name username profilePic isOnline',
        },
      })
      .sort({ createdAt: -1 });

    // Filter out any bookmarks whose posts might have been deleted
    const validPosts = bookmarks
      .filter((b) => b.post !== null)
      .map((b) => b.post);

    res.status(200).json({
      success: true,
      count: validPosts.length,
      data: validPosts,
    });
  } catch (error) {
    next(error);
  }
};
