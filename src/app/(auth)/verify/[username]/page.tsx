'use client'
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifySchema } from "@/Schemas/verifySchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import Link from "next/link";


const Page = () => {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            verificationCode: ''
        }
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        const usernames = params.username;
        try {
            console.log(data)
            await axios.post('/api/Verify-code', {
                username: usernames,
                verificationCode: data.verificationCode
            })
            toast({
                title: 'Success',
                description: 'Code verified successfully',
                duration: 2000,
                style: {
                    backgroundColor: "#dff0e0",
                    borderColor: "#7f9f7f",
                    color: "#388e3c",
                },
            })
            router.replace('/signin');

        } catch (error) {
            console.error('error in submitting otp', error)
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message;
            toast({
                title: 'Error',
                description: errorMessage,
                duration: 2000,
                variant: "destructive"
            })
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4"> Enter the verification code sent to your email.</p>
                </div>
                <div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                            <FormField
                                control={form.control}
                                name="verificationCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>One-Time Password</FormLabel>
                                        <FormControl>
                                            <InputOTP maxLength={8}  {...field}>
                                                <InputOTPGroup >
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                    <InputOTPSlot index={6} />
                                                    <InputOTPSlot index={7} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormDescription>
                                            Please enter the one-time password sent to your email.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </form>
                        <Button className="flex mx-auto mt-8" type="submit">Submit</Button>
                    </Form>
                </div>
                <div className="text-center mt-4">
                    <p>{`Did't received verification code ?`}
                        <Link href={'/signup'} className="text-blue-500 hover:text-blue-800">Sign-Up</Link>
                    </p>

                </div>
            </div>

        </div>
    )
}

export default Page
