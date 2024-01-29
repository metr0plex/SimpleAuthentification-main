import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            _id:user._id,
            name: user.name,
            surname: user.surname,
            middlename: user.middlename,
            email: user.email,
            username: user.username,
            password: user.password,
            is_confirmed: user.is_confirmed,
        },
        process.env.ACCESS_TOKEN_SECRET || '****',
        {
            expiresIn: '10m', // Access token expires in 10 minutes
        }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            _id:user._id,
            name: user.name,
            surname: user.surname,
            middlename: user.middlename,
            email: user.email,
            username: user.username,
            password: user.password,
            is_confirmed: user.is_confirmed,
        },
        process.env.REFRESH_TOKEN_SECRET || '****',
        {
            expiresIn: '10d', // Refresh token expires in 10 days
        }
    );
};



export {generateAccessToken,generateRefreshToken};

