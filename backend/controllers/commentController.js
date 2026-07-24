import Comment from '../models/commentModel.js';
import Post from '../models/postModel.js';
import Notification from '../models/notificationModel.js';

// @desc    Add comment to a post
// @route   POST /api/comments/:postId
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const { postId } = req.params;

    if (!text || !text.trim()) {
      res.status(400);
      throw new Error('Comment text cannot be empty');
    }

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    const comment = await Comment.create({
      post: postId,
      user: req.user._id,
      text: text.trim(),
    });

    // Update post comments count
    post.commentsCount += 1;
    await post.save();

    const populatedComment = await Comment.findById(comment._id).populate(
      'user',
      'name username profilePic isOnline'
    );

    // Send Notification
    if (post.user.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: post.user,
        sender: req.user._id,
        type: 'comment',
        post: postId,
      });
    }

    res.status(201).json({
      success: true,
      data: populatedComment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments for a post
// @route   GET /api/comments/:postId
// @access  Private
export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('user', 'name username profilePic isOnline')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      res.status(404);
      throw new Error('Comment not found');
    }

    const post = await Post.findById(comment.post);

    // Only comment author or post owner can delete
    const isCommentAuthor = comment.user.toString() === req.user._id.toString();
    const isPostOwner = post && post.user.toString() === req.user._id.toString();

    if (!isCommentAuthor && !isPostOwner) {
      res.status(403);
      throw new Error('You do not have permission to delete this comment');
    }

    await Comment.findByIdAndDelete(req.params.id);

    if (post && post.commentsCount > 0) {
      post.commentsCount -= 1;
      await post.save();
    }

    res.status(200).json({
      success: true,
      message: 'Comment deleted',
    });
  } catch (error) {
    next(error);
  }
};
