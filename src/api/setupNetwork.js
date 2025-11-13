import https from 'https';

const networkErrorCodes = new Set([
  'ENETUNREACH',
  'EHOSTUNREACH',
  'EAI_AGAIN',
  'ECONNRESET',
  'ECONNREFUSED',
  'ETIMEDOUT'
]);

const shouldSilenceError = (error) => {
  if (!error) {
    return false;
  }

  if (error.code && networkErrorCodes.has(error.code)) {
    return true;
  }

  if (error.name === 'AggregateError' && Array.isArray(error.errors)) {
    return error.errors.every((innerError) => networkErrorCodes.has(innerError && innerError.code));
  }

  return false;
};

const wrapRequest = (requestFn) => {
  return function patchedRequest(...args) {
    const request = requestFn.apply(this, args);

    const handleError = (error) => {
      if (shouldSilenceError(error)) {
        return;
      }

      // re-emit asynchronously so that it can be observed by other listeners
      if (request.listenerCount('error') <= 1) {
        process.nextTick(() => {
          throw error;
        });
      }
    };

    request.on('error', handleError);
    return request;
  };
};

if (!https.__codeAidPatched) {
  https.get = wrapRequest(https.get.bind(https));
  https.request = wrapRequest(https.request.bind(https));
  Object.defineProperty(https, '__codeAidPatched', {
    value: true,
    enumerable: false,
    configurable: false
  });
}
