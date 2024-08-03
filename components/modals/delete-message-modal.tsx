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

const DeleteMessageModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const { apiUrl, query } = data;

    const [isLoading, setIsLoading] = useState(false);

    const isModalOpen = isOpen && type === 'deleteMessage';

    const onClick = async () => {
        try {
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: apiUrl || '',
                query,

            })
            await axios.delete(url);

            onClose();

            toast("You Deleted the Message.", {
                description: `DELETED`,
                action: {
                    label: "Close",
                    onClick: () => console.log("Closed"),
                },
            });
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
                        Delete Message
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to Delete this? <br />
                        The message will be permanantly deleted.
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

export default DeleteMessageModal;
