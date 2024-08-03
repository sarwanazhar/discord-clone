'use client';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useModal } from '@/hooks/use-modal-store';
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";



const InviteModal = () => {
    const { isOpen, onOpen, onClose, type, data } = useModal();
    const { server } = data
    const origin = useOrigin()

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`

    const [copied, setCopied] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl)
        setCopied(true)

        toast("invite Code Copied", {
            description: "Copied.",
            action: {
              label: "Close",
              onClick: () => console.log("Closed"),
            },
          })
        setTimeout(() => {
            setCopied(false)
        }, 1000);
    }

    const onNew = async () => {
        try {
            setIsLoading(true)
            const response = await axios.patch(`/api/servers/${server?.id}/code`)

            onOpen('invite', {server: response.data})
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
            toast("Invite Code Regenerated", {
                description: "REGENERATED.",
                action: {
                  label: "Close",
                  onClick: () => console.log("Closed"),
                },
              })
        }
    }

    const isModalOpen = isOpen && type == 'invite';


    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black overflow-hidden p-0">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Invite Friends
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Server Invite Link
                    </Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input
                            readOnly={true}
                            disabled={isLoading}
                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                            value={inviteUrl}
                        />
                        <Button disabled={isLoading} size='icon' onClick={onCopy}>
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                    <Button onClick={onNew} disabled={isLoading} variant={'link'} size={'sm'} className="text-xs text-zinc-500 mt-4">
                        Generate A New Link
                        <RefreshCw className="w-4 h-4 ml-2 " />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default InviteModal;
