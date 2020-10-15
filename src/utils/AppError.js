import Constant from '../config/Constant';

class AppError extends Error {
  constructor(message) {
    super(message);
    this.errorType = Constant.ERROR_TYPE_APP;
  }
}

export default AppError;
