"use client"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Message, User } from "@/Model/User"
import { useCallback, useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { acceptMessageSchema } from "@/Schemas/acceptMessageSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/apiResponse"
import { Button } from "@/components/ui/button"
import MessageCard from "@/components/MessageCard"


const Page = () => {
    const [messages, setmessages] = useState<Message[]>([])
    const [isloading, setisloading] = useState(false)
    const [isSwitching, setisSwitching] = useState(false)
    const { toast } = useToast()
    const handleDeleteMessage = async (messageId: string) => {
        setmessages(messages.filter((message) => message._id !== messageId))

    };
    const { data: session } = useSession();
    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })
    const { register, watch, setValue } = form;
    const acceptMessages = watch('acceptMessages');
    const fetchAccpetMessages = useCallback(async () => {
        setisSwitching(true)

        try {
            const acceptStatus = await axios.get('/api/accept-Message');
            setValue('acceptMessages', acceptStatus.data.AcceptMessageStatus)

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description: axiosError.response?.data.message,
                variant: "destructive"
            })
        } finally {
            setisSwitching(false)
        }
    }, [setValue])


    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setisloading(true);
        setisSwitching(false);
        try {
            const response = await axios.get<ApiResponse>('/api/get-Messages');
            if (response.data.message === "user not found") {
                setmessages([]);
                return;
            }
            setmessages(response.data.message as any);
            if (refresh) {
                toast({
                    title: "Refreshed Messages ",
                    description: "Messages fetched successfully",
                    variant: "default",
                    style: {
                        backgroundColor: "#dff0e0",
                        borderColor: "#7f9f7f",
                        color: "#388e3c",
                    },
                })
            }
        } catch (error) {
            console.log(error)
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data.message,

                variant: "destructive"
            })
        } finally {
            setisloading(false);

            setisSwitching(false)
        }
    }, [setisloading, setmessages]);

    useEffect(() => {
        if (!session || !session.user) {
            return;
        }
        fetchMessages();
        fetchAccpetMessages();
    }, [session, setValue, fetchAccpetMessages, fetchMessages])

    // handleswitch changes
    const handleSwitchChange = async () => {
        setisSwitching(true)
        try {
            const response = await axios.post('/api/accept-Message', { acceptMessage: acceptMessages })
            setValue('acceptMessages', response.data.updatedUser.isAcceptingMessage)
            toast({
                title: "Status Changed ",
                description: "Status changed successfully",
                variant: "default",
                style: {
                    backgroundColor: "#dff0e0",
                    borderColor: "#7f9f7f",
                    color: "#388e3c",
                },
            })

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data.message,
                variant: "destructive"
            })
        } finally {
            setisSwitching(false)
        }

    }
    const username = session?.user?.username
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast({
            title: "URL Copied ",
            description: "URL copied successfully to clipboard",
            variant: "default",
            style: {
                backgroundColor: "#dff0e0",
                borderColor: "#7f9f7f",
                color: "#388e3c",
            },
        })
    }

    if (!session || !session.user) {
        return <div className="mx-auto flex"><h1 className="text-xl mx-auto flex">Please <a href="/signin" className="text-blue-600 mr-2 ml-2"> Login </a> to continue</h1>
        </div>
    }

    return (
        <div>
            <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
                <h1 className=" text-4xl font-bold mb-4">User Dashboard</h1>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold mb-2">Copy your Unique Link</h2>
                    <div className="flex items-center">
                        <input type="text" value={profileUrl} disabled className="input input-bordered w-full p-2 mr-2" />
                        <Button onClick={copyToClipboard} className="button button-primary w-96">Copy</Button>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-2 m-8">
                <Switch
                    {...register('acceptMessage')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitching}
                    id="airplane-mode" />
                <Label htmlFor="airplane-mode">Accept Messages</Label>
            </div>
            <Separator />
            <div>
                <h1 className="text-4xl mb-4 mt-4 justify-center flex font-bold">Messages</h1>
            </div>
            {messages.length > 0 ? (
                <div className="flex flex-row flex-wrap m-8 gap-8 max-w-[100%]">
                    {messages.map((message, index) => (
                        <MessageCard key={message?._id as any} message={message} onMessageDelete={handleDeleteMessage} />
                    ))}
                </div>
            ) : (
                <h2 className="text-lg font-semibold mb-4 m-4">No Messages Yet</h2>
            )}
        </div>
    );

}

export default Page
