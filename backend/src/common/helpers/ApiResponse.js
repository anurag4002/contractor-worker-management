import { StatusCodes } from 'http-status-codes';

class ApiResponse {
  /**
   * Success Response
   */
  static success(
    res,
    data = null,
    message = 'Success',
    statusCode = StatusCodes.OK
  ) {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
    });
  }

  /**
   * Created Response
   */
  static created(
    res,
    data = null,
    message = 'Resource created successfully'
  ) {
    return res.status(StatusCodes.CREATED).json({
      success: true,
      statusCode: StatusCodes.CREATED,
      message,
      data,
    });
  }

  /**
   * No Content Response
   */
  static noContent(res) {
    return res.status(StatusCodes.NO_CONTENT).send();
  }

  /**
   * Pagination Response
   */
  static paginated(
    res,
    data,
    pagination,
    message = 'Data fetched successfully'
  ) {
    return res.status(StatusCodes.OK).json({
      success: true,
      statusCode: StatusCodes.OK,
      message,
      data,
      pagination,
    });
  }
}

export default ApiResponse;