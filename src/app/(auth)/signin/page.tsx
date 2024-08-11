'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/Schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/apiResponse"

const page = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const debouncedUsername = useDebounceValue(username, 300)
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
            if (debouncedUsername) {
                setIsCheckingUsername(true);
                setUsernameMessage('');
                try {
                    const response = await axios.get(`/api/unique-username?username=${debouncedUsername}`);
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
    }, [debouncedUsername])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>('/api/signUp', data);
            toast({
                title: 'Success',
                description: 'User has been registered successfully',
                status: 'success',
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
                status: 'error',
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
            </div>

        </div>
    )
}

export default page
