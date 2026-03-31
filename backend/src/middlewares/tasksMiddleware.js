const validateFieldTitle = (req, res, next) => {
  const { body } = req;
  const title = body.title || body.titulo;

  if (title === undefined || title === null) {
    return res
      .status(400)
      .json({ message: "The field title/titulo is required" });
  }

  if (String(title).trim() === "") {
    return res.status(400).json({ message: "The title cannot be empty" });
  }

  next();
};

const validateFieldStatus = (req, res, next) => {
  const { body } = req;

  if (body.status === undefined) {
    return res.status(400).json({ message: "The field status is required" });
  }

  if (body.status === "") {
    return res.status(400).json({ message: "The status cannot be empty" });
  }

  next();
};

module.exports = {
  validateFieldTitle,
  validateFieldStatus,
};
