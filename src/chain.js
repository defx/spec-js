const isPromise = v => v instanceof Promise;

const chain = v => {
  let p = isPromise(v) ? v : Promise.resolve(v);

  const wrapper = {
    then: v => {
      p = p.then(v);
      return wrapper;
    },
    catch: v => {
      p = p.catch(v);
      return wrapper;
    },
    map: fn => {
      p = p.then(v => v.map(fn));
      return wrapper;
    },
    filter: fn => {
      p = p.then(v => v.filter(fn));
      return wrapper;
    },
    reduce: (fn, initial) => {
      p = p.then(v => v.reduce(fn, initial));
      return wrapper;
    }
  };

  return wrapper;
};

module.exports = chain;
