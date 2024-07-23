const jsonChecker = (jsonData) => {
  try {
    JSON.parse(jsonData);
    return true;
  } catch (e) {
    return false;
  }
};

module.exports = jsonChecker;
