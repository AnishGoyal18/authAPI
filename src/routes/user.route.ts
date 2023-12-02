import express from "express";
import { register, login, updateUser, resetPassword, deleteUser, recoverUser, logout } from "../controllers/user.controller";
import { authenticateUserJWT } from "../middlewares/user-auth.middleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/update", authenticateUserJWT, updateUser);
router.put("/reset-password", authenticateUserJWT, resetPassword);
router.delete("/delete", authenticateUserJWT, deleteUser);
router.post("/recover", authenticateUserJWT, recoverUser);
router.get("/logout", authenticateUserJWT, logout);

export default router;
