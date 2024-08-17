'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import Link from "next/link"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signInSchema } from "@/Schemas/signInSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/apiResponse"
import AuthLayout from '../layout';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import { request } from "http"

const Page = () => {
    const [password, setPassword] = useState('');
    const [email, setemail] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    // zod implementation
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            password: '',
            email: '',
        }
    });

    function copyUsername() {
        navigator.clipboard.writeText("testuser@gmail.com");
        toast({
            title: "Username copied to clipboard",
        });
    }

    async function copyPassword() {
        await navigator.clipboard.writeText("testuser");
        toast({
            title: "Password copied to clipboard",
        });
    }

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.email,
            password: data.password,
        })
        if (result?.error) {
            toast({
                title: "Error",
                description: 'Incorrect Email id or Password',
                variant: "destructive",
            })
            setIsSubmitting(false)
        }
        if (result?.url) {
            toast({
                title: "Success",
                description: 'Logged In Successfully',
                variant: "default",
                style: {
                    backgroundColor: "#dff0e0",
                    borderColor: "#7f9f7f",
                    color: "#388e3c",
                },
            })
            router.replace('/dashboard')
        }

    }
    return (
        <AuthLayout>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                            Sign-In to QuiteEcho
                        </h1>
                        <p className="mb-4"> Sign-In to start the anonymous adventure</p>

                    </div>
                    <div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                                <FormField
                                    name="email"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="email Id" {...field}
                                                    onChange={(e) => {

                                                        field.onChange(e)
                                                        setemail(e.target.value)
                                                    }
                                                    } />
                                            </FormControl>
                                            <FormMessage />

                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="password"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input placeholder="password" type="password" {...field}
                                                    onChange={(e) => {

                                                        field.onChange(e)
                                                        setPassword(e.target.value)
                                                    }
                                                    } />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button className="mx-auto flex hover:bg-gray-900 hover:text-white" type="submit" disabled={isSubmitting} variant="outline" >
                                    {isSubmitting ?
                                        (<>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                        </>)
                                        :
                                        ('Signin')}
                                </Button>
                            </form>
                        </Form>

                    </div>
                    <div className="text-center mt-4">
                        <p>{`Don't have an account?`}
                            <Link href={'/signup'} className="text-blue-500 hover:text-blue-800">Sign-Up</Link>
                        </p>

                    </div>
                    <div className="mt-8 p-4 bg-gray-100 rounded-md">
                        <div className="text-lg font-medium mb-2">
                            Try out demo here (Click to copy)
                        </div>
                        <p className="mb-1 cursor-pointer" onClick={() => copyUsername()}>
                            <span className="font-medium">Username:</span> testuser@gmail.com
                        </p>
                        <p className=" cursor-pointer" onClick={() => copyPassword()}>
                            <span className="font-medium">Password:</span> testuser
                        </p>
                    </div>
                </div>

            </div>
        </AuthLayout>
    )
}

export default Page
