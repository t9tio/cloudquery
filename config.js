module.exports = {
  rateLimit: {
    "windowMs": 60 * 60 * 1000, // 1 hour
    "max": 5 // limit each IP to 5 requests per windowMs
  }
}