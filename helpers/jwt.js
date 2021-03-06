const expressJwt = require("express-jwt");

function authJwt() {
  const secret = process.env.secret;
  const api = process.env.API_URL;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, method: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/product(.*)/, method: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/category(.*)/, method: ["GET", "OPTIONS"] },
      "/api/v1/users/login",
      "/api/v1/users/registers",
    ],
  });
}

async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true);
  }
  done();
}

module.exports = authJwt;
