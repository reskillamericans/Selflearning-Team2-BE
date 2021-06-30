const User = require('../models/user');

const sendSuccessResponse = (user, res, message, statusCode) => {
  res.status(statusCode).json({
    status: 'success',
    message: message,
    data: user
  });
};

const sendErrorResponse = (res, errorMessage, statusCode, error = '') => {
  if (error.kind === 'ObjectId') {
    return res.status(statusCode).json({
      status: 'success',
      errorMessage: 'Invalid user Id'
    });
  }
  res.status(statusCode).json({
    status: 'success',
    errorMessage
  });
};

// @desc        Get all users.
// @route       GET /api/v1/users
// @access      Private
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      status: 'success',
      result: users.length,
      data: {
        users
      }
    });
  } catch (error) {
    sendErrorResponse(res, `server error: ${error.message}`, 500);
  }
};

// @desc        Get user profile by user id.
// @route       GET /api/v1/users/:userID
// @access      Private
const getOneUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userID);

    if (!user) {
      return sendErrorResponse(res, 'User not found', 404);
    }
    sendSuccessResponse(user, res, 'User found', 200);
  } catch (error) {
    sendErrorResponse(res, `Server error: ${error.message}`, 500, error);
  }
};

// @desc        Get user profile by user id.
// @route       DELETE /api/v1/users/:userID
// @access      Private
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userID);

    if (!user) {
      return sendErrorResponse(res, 'User not found', 404);
    }

    sendSuccessResponse(null, res, 'User deleted successfully', 204);
  } catch (error) {
    sendErrorResponse(res, `server error: ${error.message}`, 500, error);
  }
};

// @desc        Get user profile by user id.
// @route       PATCH /api/v1/users/:userID
// @access      Private
const updateUser = async (req, res) => {
  try {
    // Check if user is trying to change his/her role to admin
    if (req.body.role === 'admin') {
      return sendErrorResponse(
        res,
        'You have no access to change your role to admin',
        400
      );
    }

    const user = await User.findById(req.params.userID);

    if (!user) {
      return sendErrorResponse(res, 'User not found', 404);
    }

    // Check if req.body contains courses and the user is a mentor
    if (req.body.courses && user.role === 'mentor') {
      const courses = [];
      [...req.body.courses, ...user.courses].forEach(el => {
        courses.push(el.toString());
      });

      // To remove duplicate course
      user.courses = [...new Set(courses)];
    }

    if (req.body.channels) {
      const channels = [...req.body.channels, ...user.channels];
      channels.forEach(el => {
        user.channels.push(el)
      });
    }

    user.name = req.body.name ? req.body.name : user.name;
    user.phone = req.body.phone ? req.body.phone : user.phone;

    await user.save({
      validateBeforeSave: false
    });

    sendSuccessResponse(user, res, 'User profile updated successfully', 200);
  } catch (error) {
    sendErrorResponse(res, `server error: ${error.message}`, 500, error);
  }
};

module.exports = {
  getAllUsers,
  getOneUser,
  updateUser,
  deleteUser
};
