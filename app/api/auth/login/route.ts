import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectToMongo } from "@/lib/mongo";
import { User } from "@/models/User";
import jwt from "jsonwebtoken";
const JWT_SECRET = "121212";
const JWT_EXPIRY = "7d";

export async function POST(req: Request) {
    try {
        await connectToMongo();

        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Email and password are required." },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found." },
                { status: 404 }
            );
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) {
            return NextResponse.json(
                { success: false, message: "Invalid password." },
                { status: 401 }
            );
        }

        // Login successful → return user info (without password)
        const { passwordHash, otp, otpExpiresAt, ...userData } = user.toObject();
        return NextResponse.json({
            success: true,
            message: "Login successful.",
            user: userData,
        });
    } catch (err: any) {
        console.error("Login error:", err);
        return NextResponse.json(
            { success: false, message: "Login failed." },
            { status: 500 }
        );
    }
}
