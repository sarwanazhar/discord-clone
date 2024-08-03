import { useSocket } from "@/components/providers/socket-provider";
import { Member, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type MessageWithMemberWithProfile = {
    member: Member & {
        profile: Profile;
    },
}

type ChatSocketProps = {
    addKey: string;
    updateKey: string;
    queryKey: string;
}

export const useChatSocket = ({
    addKey,
    updateKey,
    queryKey
}: ChatSocketProps) => {
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!socket) {
            return;
        }

        socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return oldData;
                }
                const newData = oldData.pages.map((page: any) => {
                    return {
                        ...page,
                        items: page.items.map((item: MessageWithMemberWithProfile) => {
                            if (item.member.id === message.member.id) {
                                return message;
                            }
                            return item;
                        })
                    };
                });
                return {
                    ...oldData,
                    pages: newData,
                };
            });
        });

        socket.on(addKey, (message: MessageWithMemberWithProfile) => {
            queryClient.setQueryData([queryKey], (oldData: any) => {
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return {
                        pages: [{
                            items: [message],
                        }]
                    };
                }

                const newData = [...oldData.pages];
                newData[0] = {
                    ...oldData.pages[0],
                    items: [
                        message,
                        ...oldData.pages[0].items,
                    ]
                };

                return {
                    ...oldData,
                    pages: newData,
                };
            });
        });

        return () => {
            socket.off(addKey);
            socket.off(updateKey);
        };
    }, [queryKey, addKey, queryClient, socket, updateKey]);
}
