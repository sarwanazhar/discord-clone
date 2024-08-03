'use client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from '@/hooks/use-modal-store';
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import qs from 'query-string'

const DeleteChannelModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const { server, channel } = data;
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const isModalOpen = isOpen && type === 'deleteChannel';

    const onClick = async () => {
        try {
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id
                }
            })
            await axios.delete(url);

            onClose();
            router.refresh();
            toast("You Deleted the channel.", {
                description: `#${channel?.name}`,
                action: {
                    label: "Close",
                    onClick: () => console.log("Closed"),
                },
            });
            setTimeout(() => {
                router.push(`/servers/${server?.id}`);
            }, 2000);
        } catch (error) {
            console.error(error);
            toast.error("Failed to Delete the server. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black overflow-hidden p-0">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Channel
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to Delete <span className="font-bold text-indigo-500">#{channel?.name}</span>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            variant={'ghost'}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            onClick={onClick}
                            variant={'primary'}
                            className="text-white bg-rose-400 hover:bg-red-600"
                        >
                            Delete
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteChannelModal;
