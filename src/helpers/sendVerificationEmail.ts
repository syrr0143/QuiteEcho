import { resend } from "@/lib/resend";
import verificationEmail from '@/../Emails/verificationEmailFormat'
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmails(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'QuietEcho <onboarding@resend.dev>',
            to: email,
            subject: 'QuietEcho | verification code ',
            react: verificationEmail({ username: username, otp: verifyCode }),
        });
        return {
            success: true,
            message: "Verification email sent successfully",
            isAcceptingMessage: true,
        }
    } catch (error) {
        console.error("error sending verification email error", error)
        return {
            success: false,
            message: "Error sending verification email",
        }
    }
}
