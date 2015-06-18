module.exports = function booleanFromEnv(key, defaultValue) {
  return JSON.parse(process.env[key] || defaultValue);
};

