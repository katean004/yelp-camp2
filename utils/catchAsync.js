// catch async wrapper function
// accepts function returns function with error catches it and passes to next
module.exports = func => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};
