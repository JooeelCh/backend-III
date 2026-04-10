export const successResponse = (payload, extras = {}) => ({
  status: "success",
  ...extras,
  payload,
});

export const errorResponse = (message) => ({
  status: "error",
  message,
});
