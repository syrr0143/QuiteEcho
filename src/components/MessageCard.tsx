'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Message } from "@/Model/User"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import { ApiResponse } from "@/types/apiResponse"
import { string } from "zod"

type messageCardProps = {
    message: Message,
    onMessageDelete: (messageId: string) => void,
}

const MessageCard = ({ message, onMessageDelete }: messageCardProps) => {
    const { toast } = useToast();

    // Function to format date and time
    const formatDate = (date: Date) => {
        const localDate = date.toLocaleDateString();
        const localTime = date.toLocaleTimeString();
        return `${localDate}, ${localTime}`;
    }

    // Convert ISO date string to Date object
    const messageDate = new Date(message.createdAt);

    // Handle delete confirmation
    const handleDeleteConfirm = async () => {
        try {
            await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
            toast({
                title: "Deleted",
                description: 'Message deleted successfully',
                variant: "default", style: {
                    backgroundColor: "#dff0e0",
                    borderColor: "#7f9f7f",
                    color: "#388e3c",
                },
            });
            onMessageDelete(message._id as string);
        } catch (error) {
            toast({
                title: "Error",
                description: 'Failed to delete message',
                variant: "destructive",
            });
        }
    }

    return (
        <div className="w-96">
            <Card>
                <CardHeader>
                    <CardDescription className="text-xl text-black ">{message?.content}</CardDescription>
                </CardHeader>
                <CardFooter className="text-xs justify-end text-gray-400">
                    {/* Format the date and time */}
                    <p>{formatDate(messageDate)}</p>
                </CardFooter>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="mx-auto mb-4 flex" variant="destructive">Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the message.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>No</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>Yes</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </Card>
        </div>
    )
}

export default MessageCard
