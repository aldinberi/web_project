let jwt_decode = require('jwt-decode');

export const hasValidJwt = () => {
    let token = localStorage.getItem('jwtToken');
    if (!token) { // no JWT token
        return false;
    }

    /* Try to decode the JWT - catch invalid JWTs */
    try {
        let decoded = jwt_decode(token);
        if (decoded.exp < Math.floor(Date.now() / 1000)) { // expired token
            localStorage.removeItem('jwtToken');
            return false;
        }

        /* If everything is valid, return true */
        return true;
    } catch (e) {
        return false;
    }
}