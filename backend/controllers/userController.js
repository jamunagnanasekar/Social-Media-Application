import User from '../models/userModel.js';
import Notification from '../models/notificationModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }

    const cleanedUsername = username.toLowerCase().trim();
    const cleanedEmail = email.toLowerCase().trim();

    const userExists = await User.findOne({
      $or: [{ email: cleanedEmail }, { username: cleanedUsername }],
    });

    if (userExists) {
      res.status(400);
      throw new Error(
        userExists.email === cleanedEmail
          ? 'Email address is already registered'
          : 'Username is already taken'
      );
    }

    const user = await User.create({
      name,
      username: cleanedUsername,
      email: cleanedEmail,
      password,
      isOnline: true,
      lastSeen: new Date(),
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          bio: user.bio,
          profilePic: user.profilePic,
          coverPic: user.coverPic,
          followers: user.followers,
          following: user.following,
          isOnline: user.isOnline,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data provided');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      res.status(400);
      throw new Error('Please provide email/username and password');
    }

    const input = emailOrUsername.toLowerCase().trim();

    const user = await User.findOne({
      $or: [{ email: input }, { username: input }],
    });

    if (user && (await user.matchPassword(password))) {
      user.isOnline = true;
      user.lastSeen = new Date();
      await user.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          bio: user.bio,
          profilePic: user.profilePic,
          coverPic: user.coverPic,
          followers: user.followers,
          following: user.following,
          isOnline: user.isOnline,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(401);
      throw new Error('Invalid email/username or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get profile by username
// @route   GET /api/users/profile/:username
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() }).select('-password');

    if (!user) {
      res.status(404);
      throw new Error('User profile not found');
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile details & images
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.name = req.body.name || user.name;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;

    // Check if files uploaded via Multer
    if (req.files) {
      if (req.files.profilePic && req.files.profilePic[0]) {
        user.profilePic = `/uploads/${req.files.profilePic[0].filename}`;
      }
      if (req.files.coverPic && req.files.coverPic[0]) {
        user.coverPic = `/uploads/${req.files.coverPic[0].filename}`;
      }
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        profilePic: updatedUser.profilePic,
        coverPic: updatedUser.coverPic,
        followers: updatedUser.followers,
        following: updatedUser.following,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Follow / Unfollow user
// @route   POST /api/users/follow/:id
// @access  Private
export const followUnfollowUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      res.status(400);
      throw new Error('You cannot follow yourself');
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      res.status(404);
      throw new Error('User not found');
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow logic
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUserId
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUserId.toString()
      );

      await currentUser.save();
      await targetUser.save();

      res.status(200).json({
        success: true,
        message: `Unfollowed ${targetUser.username}`,
        isFollowing: false,
      });
    } else {
      // Follow logic
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);

      await currentUser.save();
      await targetUser.save();

      // Send Notification
      await Notification.create({
        recipient: targetUserId,
        sender: currentUserId,
        type: 'follow',
      });

      res.status(200).json({
        success: true,
        message: `Followed ${targetUser.username}`,
        isFollowing: true,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Search users by name or username
// @route   GET /api/users/search?q=query
// @access  Private
export const searchUsers = async (req, res, next) => {
  try {
    const query = req.query.q || '';
    if (!query.trim()) {
      return res.status(200).json({ success: true, data: [] });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } },
      ],
    })
      .select('name username profilePic bio followers')
      .limit(10);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get suggested users to follow
// @route   GET /api/users/suggested
// @access  Private
export const getSuggestedUsers = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const suggested = await User.find({
      _id: { $ne: req.user._id, $nin: currentUser.following },
    })
      .select('name username profilePic bio followers')
      .limit(5);

    res.status(200).json({
      success: true,
      data: suggested,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user & update lastSeen / online status
// @route   POST /api/users/logout
// @access  Private
export const logoutUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.isOnline = false;
      user.lastSeen = new Date();
      await user.save({ validateBeforeSave: false });
    }
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};
