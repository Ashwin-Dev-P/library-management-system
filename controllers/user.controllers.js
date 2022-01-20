//services
const user_services = require("../services/user.service");

// Display list of all users.
const user_list = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const { limit, skip } = req.params;
  var final_result = await user_services.findAllUsers(limit, skip);
  return res.json(final_result);
};

//Get only one user
const get_user_details = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const { id } = req.params;
  var final_result = await user_services.getUserDetails(id);
  return res.json(final_result);
};

//Get profile
const get_profile = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { jwt } = req.body;
  var final_result = await user_services.getProfile(jwt);
  return res.json(final_result);
};

//register a user
const register_user = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  var { email, password, name } = req.body;

  var final_result = await user_services.registerUser(email, password, name);

  return res.json(final_result);
};

//Login
const login_user = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  var { email, password } = req.body;
  const final_result = await user_services.login(email, password);
  return res.json(final_result);
};

const issue_check = async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const { id } = req.params;
  const { jwt } = req.body;
  const result = await user_services.issue_check(jwt, id);
  return res.json(result);
};

const return_book = async (req, res) => {
  res.setHeader("Content-Type", "application/json");

  const { jwt } = req.body;
  const result = await user_services.return_book(jwt);
  return res.json(result);
};

module.exports = {
  user_list,
  register_user,
  login_user,
  issue_check,
  get_user_details,
  return_book,
  get_profile,
};
