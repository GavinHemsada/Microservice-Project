function authGuard(resolver, defaultErrorValue) {
  return async (parent, args, context, info) => {
    if (!context.user) {
      return {
        error: 'Unauthorized: Invalid or missing token',
        ...defaultErrorValue,
      };
    }
    return resolver(parent, args, context, info);
  };
}

module.exports = authGuard;
