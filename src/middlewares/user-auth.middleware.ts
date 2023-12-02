import passport from "passport";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || "secret",
};

export const userStrategyJWT = () => {
    passport.use(
        "userStrategyJWT", new JWTStrategy(jwtOptions, async (jwtPayload: any, done: any) => {
            try {
                const user = await User.findById(jwtPayload.userId);
                if (!user) return done(null, false);
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        })
    );
};

export const authenticateUserJWT = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
        "userStrategyJWT", { session: false }, (err: any, user: any) => {
            if (err || !user)
                return res.status(401).json({ message: "Unauthorized" });
            else {
                req.user = user;
                return next();
            }
        }
    )(req, res, next);
}
