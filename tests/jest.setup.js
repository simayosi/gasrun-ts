const google = {
  script: {
    funcA: () => {},
  },
};

google.script.run = {
  withSuccessHandler: function (resolve) {
    return {
      ...this,
      resolve,
    };
  },
  withFailureHandler: function (reject) {
    return {
      ...this,
      reject,
    };
  },
  funcA: function (...args) {
    call(google.script.funcA, this.resolve, this.reject, ...args);
  },
  funcB: function () {
    call(() => {}, this.resolve, this.reject);
  },
  funcC: function () {
    call(() => {}, this.resolve, this.reject);
  },
};

function call(func, resolve, reject, ...args) {
  try {
    resolve(func(...args));
  } catch (error) {
    reject(error);
  }
}

global.google = google;
