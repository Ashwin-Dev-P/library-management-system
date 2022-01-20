//Modules
const mongoose = require("mongoose");

//Models
const UserModel = mongoose.model("User");

//Repositories
const {
  getAllUsers,
  userExists,
  findOneUser,
  issueCheckRepository,
  getUserById,
  getIssuedBookIdOfUser,
  findByIdUser,
} = require("../repositories/userRepository");
const { updateOneBookById } = require("../repositories/bookRepository");

//utils
const {
  emailAndPasswordValidity,
} = require("../utils/emailAndPasswordValidity");
const { setJWT } = require("../utils/setJWT");
const jwtAuthentication = require("../utils/jwtAuthentication");
const hashPassword = require("../utils/hashPassword");
const verifyPassword = require("../utils/verifyPassword");

//Find all users
const findAllUsers = async (limit, skip) => {
  const select = "email";

  if (!limit) {
    limit = 10;
  }
  if (!skip) {
    skip = 0;
  }

  var final_result = {
    status: 200,
  };
  final_result.data = await getAllUsers(select, limit, skip);
  return final_result;
};

//get a particular user
const getUserDetails = async (_id) => {
  var result;
  const select =
    "-createdAt -updatedAt -password -__v -admin -_id -books_issue_history";
  const populate = "book_currently_issued.book";
  const populate_fields = "picture name ";
  const user = await findByIdUser(_id, select, populate, populate_fields);
  result = {
    status: 200,
    user,
  };
  return result;
};

const getProfile = async (jwt) => {
  var result;
  const jwtAuthenticationResult = await jwtAuthentication(jwt);
  if (jwtAuthenticationResult.status !== 200) {
    result = {
      message: "Not authorized",
      status: 401,
    };
    return result;
  }

  const _id = jwtAuthenticationResult._id;
  result = getUserDetails(_id);
  return result;
};

//Register a user
const registerUser = async (email, password, name) => {
  var final_result;

  //Check for input validity
  var validityResult = await emailAndPasswordValidity(email, password);
  if (validityResult !== true) {
    return validityResult;
  }

  if (!name || name.trim().length < 1) {
    final_result = {
      message: "Please enter a name",
      status: 400,
    };
    return final_result;
  }

  const filter = {
    email: email,
  };
  email_exists = await userExists(filter);
  if (!email_exists) {
    //hash password
    const hashedPasswordResult = await hashPassword(password);
    if (hashedPasswordResult.status === 200) {
      var hashedPassword = hashedPasswordResult.hash;
    }
    const user = new UserModel();
    user.email = email;
    user.password = hashedPassword;
    user.name = name;

    //Save user
    try {
      saved_user_data = await user.save();
    } catch {
      final_result = {
        message: "Unable to register",
        status: 500,
      };
      return final_result;
    }

    //Sign jwt token
    try {
      const _id = saved_user_data._id;
      var token = await setJWT(_id);
    } catch {
      final_result = {
        message: "Unable to sign jwt token",
        status: 500,
      };
      return final_result;
    }

    //user saved success and jwt token signed successfuly
    final_result = {
      token,
      message: "Registered successfully",
      status: 200,
    };
  } else {
    final_result = {
      status: 400,
      message: "Email id already in use",
    };
  }
  return final_result;
};

const login = async (email, password) => {
  //Check for input validity
  var validityResult = await emailAndPasswordValidity(email, password);
  if (validityResult !== true) {
    return validityResult;
  }

  const filter = { email: email };
  const select = "_id password";
  const user = await findOneUser(select, filter);

  //If user email not found
  if (!user || user === null) {
    final_result = {
      message: "Invalid credentials",
      status: 400,
    };
    return final_result;
  }
  var final_result;

  //valid password check
  const validPassword = await verifyPassword(user.password, password);

  //Invalid login
  if (!validPassword) {
    final_result = {
      message: "Invalid credentials",
      status: 400,
    };
    return final_result;
  } else {
    try {
      const _id = user._id;
      const token = await setJWT(_id);
      final_result = {
        token,
        message: "Login success",
        status: 200,
      };
    } catch {
      final_result = {
        message: "Unable to sign token",
        status: 400,
      };
    }
  }

  return final_result;
};

const issue_check = async (jwt, book_id) => {
  book_id = mongoose.Types.ObjectId(book_id);
  var result;

  const jwtAuthenticationResult = await jwtAuthentication(jwt);

  if (jwtAuthenticationResult.status !== 200) {
    result = {
      message: "unauthorized access",
      status: 403,
    };

    return result;
  }

  const user_id = jwtAuthenticationResult._id;

  const issued = await issueCheckRepository(user_id, book_id);
  result = {
    status: 200,
    data: issued,
  };

  return result;
};

//This below function is not in use for this project(The below function doesn't work properly)
const return_book = async (jwt) => {
  var result;

  const jwtAuthenticationResult = await jwtAuthentication(jwt);
  if (jwtAuthenticationResult.status !== 200) {
    result = {
      message: "Unauthorized",
      status: 401,
    };
    return result;
  }

  const _id = jwtAuthenticationResult._id;
  const user_id = _id;

  //Get the id of the book currently issued by the user
  const select = "book_currently_issued";

  const issued_book_id = await getIssuedBookIdOfUser(select, user_id);

  //Make the book available in the database since it is returned
  const book_update = {
    book_currently_issued: null,
    is_issued: false,
    available: true,
  };

  const book_id = String(issued_book_id._id);

  const returned = await updateOneBookById(book_id, book_update);
  if (returned.acknowledged !== true || returned.modifiedCount !== 1) {
    result = {
      message: "Unable to return book",
      status: 500,
      returned,
    };
    return result;
  }

  result = {
    message: "Book returned",
    status: 200,
  };
  return result;
};

module.exports = {
  findAllUsers,
  registerUser,
  login,
  issue_check,
  getUserDetails,
  return_book,
  getProfile,
};
