exports.generateUserId = function() {
  return 'id-' + Math.random().toString(36).substr(2, 16);
};
exports.generateSessionToken = function() {
  return 'id-' + Math.random().toString(36).substr(2, 16);
};
