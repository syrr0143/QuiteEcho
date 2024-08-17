'use client';

import { useToast } from '@/components/ui/use-toast';
import { Label } from "@/components/ui/label";
import axios from 'axios';
import { Textarea } from "@/components/ui/textarea";
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import UserModel from '@/Model/User';

const Page = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [accepting, setAccepting] = useState(false);
    const [message, setMessage] = useState('');
    const params = useParams();
    const username = params.username as string;

    const handleSendButton = async () => {
        setLoading(true);
        setIsSubmitting(true);
        try {
            const response = await axios.post('/api/send-Message', {
                username,
                content: message
            });

            if (response.data.success) {
                toast({
                    title: 'Message sent successfully!', description: response.data.message, style: {
                        backgroundColor: "#dff0e0",
                        borderColor: "#7f9f7f",
                        color: "#388e3c",
                    },
                });
                setMessage('');
            } else {
                toast({ title: 'Error', description: response.data.message });
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast({ title: 'Error', description: error.response?.data.message || 'An unexpected error occurred' });
            } else {
                toast({ title: 'Error', description: 'An unexpected error occurred' });
            }
        } finally {
            setLoading(false);
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const checkIfUserAccepting = async () => {
            console.log('this is username from the params', username)
            try {
                const response = await axios.get(`/api/find-user/${username}`);
                console.log('this is response ', response)
                if (!response.data.success) {
                    toast({
                        title: 'Error', description: response.data.message, style: {
                            backgroundColor: "#f58c84",
                            borderColor: "#f58c84",
                            color: "#388e3c",
                        },
                    });
                } else {
                    const descriptionToShow = response.data.user.isAcceptingMessage
                        ? 'User is accepting messages'
                        : 'User is not accepting messages';

                    setAccepting(response.data.user.isAcceptingMessage);
                    toast({
                        title: 'User status', description: descriptionToShow, style: {
                            backgroundColor: "#dff0e0",
                            borderColor: "#7f9f7f",
                            color: "#388e3c",
                        },
                    });


                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 404) {
                        toast({
                            title: 'Error', description: 'User not found', style: {
                                backgroundColor: "#f58c84",
                                borderColor: "#f58c84",
                                color: "#388e3c",
                            },
                        });
                    } else {
                        toast({
                            title: 'Error', description: error.response?.data.message || 'An unexpected error occurred', style: {
                                backgroundColor: "#f58c84",
                                borderColor: "#f58c84",
                                color: "#388e3c",
                            },
                        });
                    }
                } else {
                    toast({
                        title: 'Error', description: 'An unexpected error occurred', style: {
                            backgroundColor: "#f58c84",
                            borderColor: "#f58c84",
                            color: "#388e3c",
                        },
                    });
                }
            }
        };
        if (username) {
            checkIfUserAccepting();
        }
    }, [username, toast]);

    return (
        <div className='mt-12 gap-4 justify-center'>
            <div>
                <h1 className='justify-center flex text-6xl capitalize font-extrabold text-black'>Public profile link</h1>
            </div>
            <div className='w-[50vw] mt-12 mx-auto'>
                <Label className='text-2xl mt-4' htmlFor="message">Send Anonymous message to any user:</Label>
                <Textarea
                    id="message"
                    className='mt-4'
                    placeholder="Type your message here....."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <div className='justify-end mt-12 flex'>
                    <Button onClick={handleSendButton} disabled={accepting == false || isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                            </>
                        ) : ('Send message')}
                    </Button>
                </div>
            </div>
            <div className='w-[50vw] mt-12 mx-auto'>
                <Label className='text-2xl' htmlFor="terms">Get your anonymous messages dashboard</Label>
                <div className='justify-end mt-4 flex'>
                    <Link href="/signup" passHref>
                        <Button>Sign Up</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Page;
