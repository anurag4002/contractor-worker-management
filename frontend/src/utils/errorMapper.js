const FALLBACK_MESSAGE = "Something went wrong. Please try again later.";
const FIELD_FALLBACK_MESSAGE = "Please check this field.";
const VALIDATION_MESSAGE = "Please check the highlighted fields.";

const statusMessages = {
  400: VALIDATION_MESSAGE,
  401: "Your session has expired. Please log in again.",
  403: "You do not have permission to perform this action.",
  404: "The requested resource could not be found.",
  409: "This record already exists.",
  413: "The selected file is too large. Please upload a smaller file.",
  415: "This file format is not supported.",
  422: VALIDATION_MESSAGE,
  429: "Too many requests. Please wait a moment and try again.",
  500: "An unexpected server error occurred. Our team has been notified.",
  502: "The server is currently unavailable. Please try again later.",
  503: "The server is currently unavailable. Please try again later.",
  504: "The server is taking longer than expected. Please try again.",
};

const technicalPatterns = [
  /\baxios(error)?\b/i,
  /\bmongo(server)?error\b/i,
  /\bmongodb\b/i,
  /\.mongodb\.net\b/i,
  /\bmongoose\b/i,
  /\bcast(error)?\b/i,
  /\bvalidationerror\b/i,
  /\bjsonwebtok(en|enerror)\b/i,
  /\btokenexpirederror\b/i,
  /\bduplicate key\b/i,
  /\be11000\b/i,
  /\bobjectid\b/i,
  /\bbson\b/i,
  /\bgetaddrinfo\b/i,
  /\beai_again\b/i,
  /\benotfound\b/i,
  /\beconnrefused\b/i,
  /\beconnaborted\b/i,
  /\betimedout\b/i,
  /\berr_network\b/i,
  /\berr_bad_(request|response)\b/i,
  /\berr_internet_disconnected\b/i,
  /request failed with status code/i,
  /internal server error/i,
  /stack trace/i,
  /\bat\s+.+\(.+:\d+:\d+\)/i,
  /cannot read propert(y|ies)/i,
  /\bis not a function\b/i,
  /\bis not iterable\b/i,
  /\bundefined\b/i,
];

const friendlyStringPatterns = [
  /^please\b/i,
  /^your\b/i,
  /^the\b/i,
  /^this\b/i,
  /^an\b/i,
  /^something\b/i,
  /^unable to\b/i,
  /^no\b/i,
  /^nothing\b/i,
  /^report\b/i,
  /^invalid\b/i,
  /^failed to\b/i,
  /^enter\b/i,
  /^password/i,
  /^current password/i,
  /^new password/i,
  /required/i,
  /must be/i,
  /do not match/i,
  /missing/i,
  /complete/i,
  /check/i,
  /successfully/i,
  /not available/i,
  /not valid/i,
  /not supported/i,
  /try again/i,
  /already exists/i,
  /could not be found/i,
  /too large/i,
];

const normalizeText = (value) => (typeof value === "string" ? value.trim() : "");

const getResponseData = (error) => error?.response?.data;

const getServerMessage = (error) => {
  const data = getResponseData(error);

  if (typeof data === "string") return data;
  if (!data || typeof data !== "object") return "";

  return normalizeText(data.message || data.error || data.title || data.detail);
};

const getRequestUrl = (error) => normalizeText(error?.config?.url || error?.request?.responseURL);

const parseStatusFromText = (text) => {
  const match =
    normalizeText(text).match(/status(?: code)?\s*(\d{3})/i) ||
    normalizeText(text).match(/\b(400|401|403|404|409|413|415|422|429|500|502|503|504)\b/);

  return match ? Number(match[1]) : null;
};

const getStatus = (errorOrMessage) => {
  if (typeof errorOrMessage === "string") {
    return parseStatusFromText(errorOrMessage);
  }

  return (
    errorOrMessage?.response?.status ||
    errorOrMessage?.status ||
    errorOrMessage?.statusCode ||
    parseStatusFromText(getServerMessage(errorOrMessage)) ||
    parseStatusFromText(errorOrMessage?.message)
  ) || null;
};

const getRawText = (errorOrMessage) => {
  if (typeof errorOrMessage === "string") return errorOrMessage;

  const parts = [
    errorOrMessage?.name,
    errorOrMessage?.code,
    errorOrMessage?.message,
    errorOrMessage?.response?.statusText,
    getServerMessage(errorOrMessage),
  ];

  return parts.filter(Boolean).join(" ");
};

const hasTechnicalDetails = (text) => {
  const value = normalizeText(text);
  return value ? technicalPatterns.some((pattern) => pattern.test(value)) : false;
};

const isFriendlyString = (text) => {
  const value = normalizeText(text);
  if (!value || hasTechnicalDetails(value)) return false;

  return friendlyStringPatterns.some((pattern) => pattern.test(value));
};

const mapByText = (text) => {
  const value = normalizeText(text);
  if (!value) return null;

  const lower = value.toLowerCase();

  if (lower.includes("file too large") || lower.includes("payload too large")) {
    return statusMessages[413];
  }

  if (lower.includes("unsupported file") || lower.includes("unsupported media") || lower.includes("file format")) {
    return statusMessages[415];
  }

  if (lower.includes("token expired") || lower.includes("tokenexpirederror") || lower.includes("jwt expired")) {
    return "Your login session has expired. Please sign in again.";
  }

  if (lower.includes("invalid token") || lower.includes("jsonwebtok")) {
    return statusMessages[401];
  }

  if (lower.includes("invalid credential") || lower.includes("invalid email") || lower.includes("invalid password")) {
    return "Invalid email or password. Please check your details and try again.";
  }

  if (lower.includes("permission") || lower.includes("forbidden")) {
    return statusMessages[403];
  }

  if (lower.includes("not found")) {
    return statusMessages[404];
  }

  if (
    lower.includes("duplicate") ||
    lower.includes("e11000") ||
    lower.includes("already exists") ||
    lower.includes("unique")
  ) {
    return "This value already exists.";
  }

  if (
    lower.includes("validation") ||
    lower.includes("casterror") ||
    lower.includes("cast error") ||
    lower.includes("objectid") ||
    lower.includes("bson")
  ) {
    return VALIDATION_MESSAGE;
  }

  if (lower.includes("econnrefused")) {
    return statusMessages[502];
  }

  if (
    lower.includes("server selection timed out") ||
    lower.includes("mongo timeout") ||
    lower.includes("econnaborted") ||
    lower.includes("etimedout") ||
    lower.includes("timeout") ||
    lower.includes("timed out")
  ) {
    return statusMessages[504];
  }

  if (
    lower.includes("network error") ||
    lower.includes("err_network") ||
    lower.includes("err_internet_disconnected")
  ) {
    return "No internet connection detected. Please check your connection and try again.";
  }

  if (
    lower.includes("getaddrinfo") ||
    lower.includes("eai_again") ||
    lower.includes("enotfound") ||
    lower.includes("mongodb.net")
  ) {
    return "Unable to connect to the server. Please check your internet connection or try again in a few moments.";
  }

  if (lower.includes("mongoservererror") || lower.includes("mongodb") || lower.includes("mongoose")) {
    return statusMessages[500];
  }

  if (lower.includes("axios")) {
    return "Something went wrong while communicating with the server.";
  }

  if (lower.includes("public registration is disabled")) {
    return "An administrator account already exists. Please use the login page.";
  }

  if (lower.includes("internal server error")) {
    return statusMessages[500];
  }

  if (lower.includes("export failed")) {
    return "Report download failed. Please try again.";
  }

  return null;
};

const mapByStatus = (status, rawText, requestUrl) => {
  if (!status) return null;
  const textMessage = mapByText(rawText);

  if (status === 401) {
    const text = normalizeText(rawText).toLowerCase();
    const url = normalizeText(requestUrl).toLowerCase();

    if (url.includes("/auth/login") || text.includes("credential") || text.includes("password")) {
      return "Invalid email or password. Please check your details and try again.";
    }
  }

  if (
    (status === 400 || status === 422) &&
    textMessage &&
    textMessage !== "Something went wrong while communicating with the server."
  ) {
    return textMessage;
  }

  if (status === 409 && textMessage) {
    return textMessage;
  }

  if (status === 403) {
    const text = normalizeText(rawText).toLowerCase();

    if (text.includes('trial') || text.includes('subscription expired') || text.includes('expired. please subscribe')) {
      return 'Your trial or subscription has expired. Please subscribe to continue.';
    }

    if (text.includes('tenant context')) {
      return 'Your account is not associated with a tenant. Please contact support.';
    }
  }

  if (statusMessages[status]) return statusMessages[status];

  if (status >= 400 && status < 500) {
    return "The request could not be completed. Please check your input and try again.";
  }

  if (status >= 500) {
    return statusMessages[500];
  }

  return null;
};

const getRawFieldErrors = (error) => {
  const data = getResponseData(error);
  const errors = data?.errors;

  return errors && typeof errors === "object" && !Array.isArray(errors) ? errors : {};
};

const sanitizeFieldMessage = (message) => {
  const text = Array.isArray(message)
    ? message.map(sanitizeFieldMessage).filter(Boolean).join(" ")
    : normalizeText(
        typeof message === "object" && message !== null
          ? message.message
          : message
      );

  if (!text) return FIELD_FALLBACK_MESSAGE;

  const mapped = mapByText(text);
  if (mapped === VALIDATION_MESSAGE) return FIELD_FALLBACK_MESSAGE;
  if (mapped) return mapped;
  if (hasTechnicalDetails(text)) return FIELD_FALLBACK_MESSAGE;

  return text;
};

const sanitizeFieldErrors = (fieldErrors = {}) => Object.entries(fieldErrors).reduce(
  (safeErrors, [field, message]) => ({
    ...safeErrors,
    [field]: sanitizeFieldMessage(message),
  }),
  {}
);

const mapAxiosError = (errorOrMessage) => {
  const status = getStatus(errorOrMessage);
  const rawText = getRawText(errorOrMessage);
  const requestUrl = getRequestUrl(errorOrMessage);
  const fieldErrors = sanitizeFieldErrors(getRawFieldErrors(errorOrMessage));

  // Network-level Axios error (no HTTP response received)
  if (
    errorOrMessage &&
    typeof errorOrMessage === "object" &&
    !errorOrMessage.response &&
    (errorOrMessage.code === "ERR_NETWORK" || errorOrMessage.code === "ECONNREFUSED")
  ) {
    const lowerUrl = normalizeText(requestUrl).toLowerCase();

    if (lowerUrl.includes("localhost") || lowerUrl.includes("127.0.0.1")) {
      return {
        userMessage:
          "Unable to connect to the backend server. Please check that the server is running.",
        status: null,
        fieldErrors,
        isOperational: true,
      };
    }

    return {
      userMessage:
        "No internet connection detected. Please check your connection and try again.",
      status: null,
      fieldErrors,
      isOperational: true,
    };
  }

  const mappedMessage =
    mapByStatus(status, rawText, requestUrl) ||
    mapByText(rawText) ||
    (typeof errorOrMessage === "string" && isFriendlyString(errorOrMessage)
      ? normalizeText(errorOrMessage)
      : FALLBACK_MESSAGE);

  return {
    userMessage: mappedMessage,
    status,
    fieldErrors,
    isOperational: Boolean(errorOrMessage?.response || errorOrMessage?.request || status),
  };
};

const getFriendlyMessage = (errorOrMessage) => mapAxiosError(errorOrMessage).userMessage;

export {
  FALLBACK_MESSAGE,
  VALIDATION_MESSAGE,
  hasTechnicalDetails,
  mapAxiosError,
  getFriendlyMessage,
  sanitizeFieldErrors,
};

export default getFriendlyMessage;
