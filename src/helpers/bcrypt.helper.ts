const bcrypt = require("bcryptjs");

export async function hashPassword(plainPassword: string) {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
}

export async function checkPassword(
    plainPassword: string,
    hashedPassword: string
) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}
