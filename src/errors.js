class UserError extends Error {
  constructor(message = 'User Error') {
    super(message);
    this.code = 400;
  }
}

class AuthenticationError extends UserError {
  constructor(message = 'Authentication Error') {
    super(message);
    this.code = 401;
  }
}

class NotFoundError extends UserError {
  constructor(message = 'Not Found Error') {
    super(message);
    this.code = 404;
  }
}

module.exports = {
  AuthenticationError,
  UserError,
  NotFoundError,
};
