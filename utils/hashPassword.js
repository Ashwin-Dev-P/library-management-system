const argon2 = require("argon2");

const hashPassword = async (password) => {
  var result;
  try {
    const hash = await argon2.hash(password);
    result = {
      status: 200,
      hash,
    };
  } catch (err) {
    result = {
      status: 500,
    };
  }
  return result;
};

module.exports = hashPassword;
