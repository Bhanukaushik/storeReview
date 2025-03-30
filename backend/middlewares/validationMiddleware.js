
exports.validateUserRegistration = [
    body('name')
        .isLength({ min: 20, max: 60 })
        .withMessage('Name must be between 20 and 60 characters.'),
    body('email')
        .isEmail()
        .withMessage('Invalid email format.'),
    body('password')
        .isLength({ min: 8, max: 16 })
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter.')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Password must contain at least one special character.'),
    body('address')
        .isLength({ max: 400 })
        .withMessage('Address can be a maximum of 400 characters.'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


exports.validateStore = (req, res, next) => {
  const { name, email, address } = req.body;
  if (!name || !email || !address) {
      return res.status(400).json({ error: "All fields are required" });
  }
  next();
};

exports.validateRating = (req, res, next) => {
  const { rating } = req.body;
  if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }
  next();
};
