
let baseUrl;
if (!process.env.HEROKU) {
    baseUrl = 'http://localhost:3001/'
} else {
    baseUrl = `http://localhost:${process.env.PORT}/`
}

module.exports = {
    BASE_URL: baseUrl
}