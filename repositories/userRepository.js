//Modules
const mongoose = require("mongoose");

//Models
const UserModel = mongoose.model("User");

const getAllUsers = async (select, limit, skip) => {
  limit = Number(limit);
  skip = Number(skip);
  var users = await UserModel.find()
    .skip(skip)
    .limit(limit)
    .select(select)
    .lean();
  return users;
};

const findByIdUser = async (_id, select, populate, populate_fields) => {
  const user = await UserModel.findById(_id)
    .select(select)
    .populate(populate, populate_fields)
    .lean();
  return user;
};

const updateUser = async (filter, update) => {
  const updated_user = await UserModel.updateOne(filter, update);
  return updated_user;
};

const userExists = async (filter) => {
  var exists = await UserModel.exists(filter);
  return exists;
};

const findOneUser = async (select, filter) => {
  var user = await UserModel.findOne(filter).select(select).lean();
  return user;
};

const issueCheckRepository = async (user_id, book_id) => {
  const issued = await UserModel.exists({
    _id: user_id,
    "book_currently_issued.book": book_id,
  });
  return issued;
};

const getUserById = async (_id) => {
  const user = await UserModel.findById(_id).lean();
  return user;
};

const getIssuedBookIdOfUser = async (select, user_id) => {
  //user_id = mongoose.Types.ObjectId(user_id)
  const book_id = await UserModel.findById(user_id).select(select).lean();
  return book_id;
};

module.exports = {
  getAllUsers,
  userExists,
  findByIdUser,
  updateUser,
  findOneUser,
  issueCheckRepository,
  getUserById,
  getIssuedBookIdOfUser,
};
