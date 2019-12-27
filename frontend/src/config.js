
let baseUrl;
if (!process.env.HEROKU) {
    baseUrl = 'http://localhost:3001/'
} else {
    baseUrl = process.env.BASE_URL
}

module.exports = {
    BASE_URL: baseUrl
}