/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router, Request, Response } from "express";
import { storage } from "../storage";

const router = Router();

// Validate founder security questions securely on server
const FOUNDER_SECURITY_ANSWERS: Record<string, (ans: string) => boolean> = {
  father_dob: (ans: string) => {
    const norm = ans.trim().toLowerCase().replace(/[-_/,\s]+/g, " ");
    return norm === "28 june 1974" || norm === "28 jun 1974";
  },
  first_office: (ans: string) => {
    const norm = ans.trim().toLowerCase();
    return norm === "dhar" || norm.includes("dhar");
  },
  mother_maiden: (ans: string) => {
    const norm = ans.trim().toLowerCase();
    return norm === "sharma";
  },
  first_ev: (ans: string) => {
    const norm = ans.trim().toLowerCase();
    return norm === "vista" || norm === "volmo vista";
  },
};

// POST /api/auth/login
router.post("/login", (req: Request, res: Response) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const auth = storage.getAuth();
    if (password === auth.adminPassword) {
      const token = storage.createSession();
      return res.json({
        success: true,
        message: "Admin authentication successful",
        token,
      });
    }

    return res.status(401).json({
      success: false,
      error: "Incorrect password. Access denied.",
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Authentication error" });
  }
});

// POST /api/auth/verify-security
router.post("/verify-security", (req: Request, res: Response) => {
  try {
    const { questionId, answer } = req.body;
    if (!questionId || !answer) {
      return res.status(400).json({ error: "questionId and answer are required" });
    }

    const validator = FOUNDER_SECURITY_ANSWERS[questionId];
    if (!validator) {
      return res.status(400).json({ error: "Invalid security question identifier" });
    }

    if (validator(answer)) {
      return res.json({
        verified: true,
        message: "Identity verified successfully. You may now reset your password.",
      });
    }

    return res.status(403).json({
      verified: false,
      error: "Incorrect answer to security question. Reset failed.",
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Verification error" });
  }
});

// POST /api/auth/reset-password
router.post("/reset-password", (req: Request, res: Response) => {
  try {
    const { questionId, answer, newPassword } = req.body;
    if (!questionId || !answer || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const validator = FOUNDER_SECURITY_ANSWERS[questionId];
    if (!validator || !validator(answer)) {
      return res.status(403).json({ error: "Security answer verification failed" });
    }

    if (newPassword.trim().length < 4) {
      return res.status(400).json({ error: "Password must be at least 4 characters long" });
    }

    storage.updatePassword(newPassword.trim());
    const token = storage.createSession();

    return res.json({
      success: true,
      message: "Password reset successfully",
      token,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Reset password error" });
  }
});

// POST /api/auth/change-password
router.post("/change-password", (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current password and new password are required" });
    }

    const auth = storage.getAuth();
    if (currentPassword !== auth.adminPassword) {
      return res.status(401).json({ error: "Current password does not match" });
    }

    if (newPassword.trim().length < 4) {
      return res.status(400).json({ error: "New password must be at least 4 characters" });
    }

    storage.updatePassword(newPassword.trim());
    return res.json({
      success: true,
      message: "Admin password updated successfully on server",
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Change password error" });
  }
});

export default router;
