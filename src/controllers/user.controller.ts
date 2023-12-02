import { Request, Response } from "express";
import { RegistrationInterface, LoginInterface, UpdateUserInterface, ResetPasswordInterface } from "../interfaces/user.interface";
import { hashPassword, checkPassword } from "../helpers/bcrypt.helper";
import { generateJwtUserToken } from "../helpers/jwt.helper";
import User from "../models/user.model";

export async function register(req: Request, res: Response) {
    const { name, username, bio, age, password }: RegistrationInterface = req.body;
    try {
        const hashedPassword = await hashPassword(password);
        const newUser = new User({
            name,
            username,
            bio,
            age,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Registration failed" });
    }
}

export async function login(req: Request, res: Response) {
    const { username, password }: LoginInterface = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const storedHashedPassword = user.password;
        const isPasswordValid = await checkPassword(
            password,
            storedHashedPassword
        );

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateJwtUserToken(user._id);
        res.cookie('authToken', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Login failed" });
    }
}

export async function updateUser(req: Request, res: Response) {
    const userId = (req.user as any)._id;
    const { name, username, bio, age }: UpdateUserInterface = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                name,
                username,
                bio,
                age,
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User details updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update user details" });
    }
}

export async function resetPassword(req: Request, res: Response) {
    const userId = (req.user as any)._id;
    const { oldPassword, newPassword }: ResetPasswordInterface = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await checkPassword(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid old password" });
        }

        const hashedPassword = await hashPassword(newPassword);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { password: hashedPassword },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Password updated successfully",
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update password" });
    }
}

export async function deleteUser(req: Request, res: Response) {
    const userId = (req.user as any)._id;
    const { password }: { password: string } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await checkPassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password." });
        }

        await User.findByIdAndUpdate(
            userId,
            { deletedAt: new Date() },
        );

        res.status(200).json({
            message: "User account will be deleted after 7 days if not recovered",
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete user account" });
    }
}

export async function recoverUser(req: Request, res: Response) {
    const userId = (req.user as any)._id;
    try {
        const user = await User.findByIdAndUpdate(
            userId, 
            { $unset: { deletedAt: null } }, 
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User account recovered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to recover user account" });
    }
}

export function logout(req: Request, res: Response) {
    res.clearCookie('authToken');
    res.status(200).json({ message: "User logged out successfully" });
}
