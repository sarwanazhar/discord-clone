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

const LeaveModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const { server } = data;
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const isModalOpen = isOpen && type === 'leaveServer';

    const onClick = async () => {
        try {
            setIsLoading(true);
            await axios.patch(`/api/servers/${server?.id}/leave`);

            onClose();
            router.refresh();
            toast("You left the server.", {
                description: server?.serverName + ".",
                action: {
                    label: "Close",
                    onClick: () => console.log("Closed"),
                },
            });
            router.push('/');
        } catch (error) {
            console.error(error);
            toast.error("Failed to leave the server. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black overflow-hidden p-0">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Leave Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to leave <span className="font-semibold text-indigo-500">{server?.serverName}</span>?
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
                        >
                            Leave
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default LeaveModal;
