import * as jwt from "jsonwebtoken";

const JWT_USER_SECRET = "secret";

export function generateJwtUserToken(userId: any) {
    return jwt.sign(
        {
            userId: userId,
        },
        JWT_USER_SECRET,
        {
            expiresIn: "1h",
        }
    );
}
