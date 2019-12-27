
// let baseUrl;
// if (!process.env.HEROKU) {
//     baseUrl = 'http://localhost:3001/'
// } else {
//     baseUrl = ''
// }

module.exports = {
    BASE_URL: process.env.HEROKU || 'http://localhost:3001/'
}