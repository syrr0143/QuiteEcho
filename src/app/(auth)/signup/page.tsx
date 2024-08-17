'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/Schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/apiResponse"
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

const Page = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setemail] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const debounced = useDebounceCallback(setUsername, 500)
    // zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            password: '',
            email: '',
        }
    });

    useEffect(() => {
        const checkUserameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true);
                setUsernameMessage('');
                try {
                    const response = await axios.get(`/api/unique-username?username=${username}`);
                    setUsernameMessage(response.data.message);
                } catch (error) {
                    const axioserror = error as AxiosError<ApiResponse>;
                    setUsernameMessage(axioserror.response?.data.message ?? 'Error while checkcing username')


                } finally {
                    setIsCheckingUsername(false);
                }
            }
        }
        checkUserameUnique();
    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        console.log(data);
        try {
            const response = await axios.post<ApiResponse>('/api/signUp', data);
            toast({
                title: 'Success',
                description: 'User has been registered successfully',
                variant: "default",
                style: {
                    backgroundColor: "#dff0e0",
                    borderColor: "#7f9f7f",
                    color: "#388e3c",
                },
            })
            router.replace(`/verify/${username}`);
            setIsSubmitting(false);
        } catch (error) {
            console.error('error in signup ', error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errormessage = axiosError.response?.data.message
            toast({
                title: 'Signup failed ',
                description: errormessage ?? 'An error occurred while signing up',
                variant: 'default',
            })
            setIsSubmitting(false);

        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join QuiteEcho
                    </h1>
                    <p className="mb-4"> Signup to start the anonymous adventure</p>
                </div>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                name="username"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="username" {...field}
                                                onChange={(e) => {

                                                    field.onChange(e)
                                                    debounced(e.target.value)
                                                }
                                                } />
                                        </FormControl>
                                        {isCheckingUsername && <Loader2 className="animate-spin" />}
                                        <p className={`text-sm ${usernameMessage === "username is unique" ? 'text-green-500' : 'text-red-500'}`}>{usernameMessage}</p>
                                        <FormMessage />

                                    </FormItem>
                                )}
                            />
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
                                    ('Signup')}
                            </Button>
                        </form>
                    </Form>

                </div>
                <div className="text-center mt-4">
                    <p>Already a member?{' '}
                        <Link href={'/signin'} className="text-blue-500 hover:text-blue-800">Sign In</Link>
                    </p>

                </div>
            </div>

        </div>
    )
}

export default Page
