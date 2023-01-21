Promise.myRace = function (promises) {
  return new Promise((resolve, reject) => {
    promises.forEach((promise) => {
      promise.then(resolve).catch(reject);
    });
  });
};

Promise.myAny = function (promises) {
  return new Promise((resolve, reject) => {
    let rejectedCount = 0;
    if (promises.length === 0) {
      reject("AggregateError: All promises were rejected");
    }
    promises.forEach((promise) => {
      promise.then(resolve).catch(() => {
        rejectedCount++;
        if (rejectedCount === promises.length) {
          reject("AggregateError: All promises were rejected");
        }
      });
    });
  });
};

Promise.myAll = function (promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let resolvedCount = 0;
    promises.forEach((promise, index) => {
      promise
        .then((res) => {
          results[index] = res;
          resolvedCount++;
          if (resolvedCount === promises.length) {
            resolve(results);
          }
        })
        .catch(reject);
    });
  });
};

Promise.myAllSettled = function (promises) {
  return new Promise((resolve) => {
    const resolvedArray = [];
    let counter = 0;
    if (promises.length === 0) {
      resolve(resolvedArray);
    }
    promises.forEach((promise, index) => {
      if (!isPromise(promise)) {
        promise = Promise.resolve(promise);
      }
      promise
        .then((value) => {
          resolvedArray[index] = { status: "fulfilled", value };
        })
        .catch((reason) => {
          resolvedArray[index] = { status: "rejected", reason };
        })
        .finally(() => {
          counter++;
          if (counter === promises.length) {
            resolve(resolvedArray);
          }
        });
    });
  });
};

function isPromise(p) {
  if (typeof p === "object" && typeof p.then === "function") {
    return true;
  }
  return false;
}

Promise.myAllSettled([
  Promise.resolve(33),
  new Promise((resolve) => setTimeout(() => resolve(66), 0)),
  99,
  Promise.reject(new Error("an error")),
]);
// [
//   { status: 'fulfilled', value: 33 },
//   { status: 'fulfilled', value: 66 },
//   { status: 'fulfilled', value: 99 },
//   { status: 'rejected', reason: Error: an error }
// ]
