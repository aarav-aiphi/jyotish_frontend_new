import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalTrigger,
} from "./animated-modal";
import { cn, getCookie } from "@/lib/utils";
import { useAppDispatch } from '@/redux/hooks';
import { setConnectingAstrologer, clearConnectingAstrologer } from '@/redux/chatSlice';

interface ChatModalProps {
    astrologer: {
        user: {
            _id: string;
            name: string;
        };
    };
}

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};

export function ChatModal({ astrologer }: ChatModalProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState({
        name: '',
        gender: '',
        date: '',
        time: '',
        place: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            dispatch(setConnectingAstrologer({
                id: astrologer.user._id,
                name: astrologer.user.name,
            }));
            const token = getCookie('token'); 

            const response = await fetch(`/api/v1/chat/init`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    astrologerId: astrologer.user._id,
                    userDetails: formData
                })
            });

            if (!response.ok) {
                throw new Error('Failed to initialize chat');
            }

            const data = await response.json();
            dispatch(clearConnectingAstrologer());
            router.push(`/chat-with-astrologer/chat?chatId=${data.chatId}`);
        } catch (error) {
            dispatch(clearConnectingAstrologer());
            console.error('Error:', error);
            alert(error);
        }
    };

    return (
        <div className="flex justify-center p-6 pt-1">
            <Modal>
                <ModalTrigger className="bg-black dark:bg-white dark:text-black text-white flex justify-center group/modal-btn">
                    <span className="group-hover/modal-btn:translate-x-40 text-center transition duration-500">
                        Chat / Call
                    </span>
                    <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
                        Now
                    </div>
                </ModalTrigger>

                <ModalBody>
                    <form onSubmit={handleSubmit}>
                        <ModalContent>
                            <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
                                We Need Your Info To Chat with{" "}
                                <span className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200">
                                    {astrologer.user.name}
                                </span>
                            </h4>

                            <div className='flex'>
                                <LabelInputContainer>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Satyam"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </LabelInputContainer>
                                <LabelInputContainer>
                                    <Label htmlFor="gender">Gender</Label>
                                    <select
                                        id="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="flex h-10 w-full bg-gray-50 dark:bg-zinc-800 text-black dark:text-white rounded-md px-3 py-2 text-sm"
                                    >
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </LabelInputContainer>
                            </div>
                            <div className='flex'>
                                <LabelInputContainer>
                                    <Label htmlFor="date">Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        className="w-full"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                    />
                                </LabelInputContainer>

                                <LabelInputContainer>
                                    <Label htmlFor="time">Time of Birth</Label>
                                    <Input
                                        id="time"
                                        type="time"
                                        className="w-full"
                                        value={formData.time}
                                        onChange={handleInputChange}
                                    />
                                </LabelInputContainer>
                            </div>
                            <LabelInputContainer>
                                <Label htmlFor="place">Place of Birth</Label>
                                <Input
                                    id="place"
                                    placeholder="Hyderabad"
                                    type="text"
                                    value={formData.place}
                                    onChange={handleInputChange}
                                />
                            </LabelInputContainer>

                            <button
                                className="bg-black text-white dark:bg-white dark:text-black relative group/btn w-full rounded-md h-10 font-medium"
                                type="submit"
                            >
                                Chat &rarr;
                            </button>
                        </ModalContent>
                    </form>
                </ModalBody>
            </Modal>
        </div>
    );
}
