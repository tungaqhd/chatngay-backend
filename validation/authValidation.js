const { check } = require("express-validator");
module.exports = {
  register: () => {
    return [
      check("username", "Username is not valid")
        .notEmpty()
        .isLength({ min: 4, max: 15 })
        .withMessage("Username length must be between 4 and 15 characters")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage(
          "Username should contain only alphabets, numbers and underlined"
        )
        .trim(),
      check("name", "Name is not valid")
        .notEmpty()
        .withMessage("Name is required")
        .trim(),
      check("email", "Email is required").isEmail().normalizeEmail(),
      check("password", "Password is not valid").isLength({ min: 6 }).trim(),
      check("confirm_password", "Confirm Password is required")
        .notEmpty()
        .custom((value, { req }) => {
          if (value !== req.body.password) {
            throw new Error("Confirm password does not match");
          }
          return true;
        })
        .trim(),
    ];
  },
  login: () => {
    return [
      check("username", "Invalid username or password")
        .isLength({ min: 4, max: 15 })
        .trim(),
      check("password", "Password is not valid").isLength({ min: 6 }).trim(),
    ];
  },
  forgotPassword: () => {
    return [
      check("email", "Email is required").isEmail().normalizeEmail(),
      check("captcha", "Captcha is required").isObject(),
    ];
  },
  resetPassword: () => {
    return [
      check("secret", "Invalid request").isLength({ min: 15 }).trim(),
      check("captcha", "Captcha is required").isObject(),
      check("password", "Password is required").isLength({ min: 6 }).trim(),
      check("confirmPassword", "Confirm Password is required")
        .notEmpty()
        .custom((value, { req }) => {
          if (value !== req.body.password) {
            throw new Error("Confirm password does not match");
          }
          return true;
        })
        .trim(),
    ];
  },
};
