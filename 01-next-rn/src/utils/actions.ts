'use server'
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { InactiveAccountError, InvalidEmailPasswordError } from "./errors";
// import { signIn } from "@/auth";

export async function authenticate(username: string, password: string) {
    try {
        const r = await signIn("credentials", {
            username: username,
            password: password,
            redirect: false,
        })
        console.log(">>> Check r: ", r);
        return r;
    } catch (error: any) {
        // return { error: "Sai tên đăng nhập hoặc mật khẩu" }
        // Bắt đúng loại lỗi NextAuth đã ném
        if (error instanceof InactiveAccountError) {
            return { error: "InactiveAccountError" };
        }

        if (error instanceof InvalidEmailPasswordError) {
            return { error: "InvalidEmailPasswordError" };
        }

        // các lỗi khác
        return { error: "Sai tên đăng nhập hoặc mật khẩu" };
    }
}