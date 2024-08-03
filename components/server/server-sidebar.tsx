import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeaader from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import ServerSection from "./server-section";
import { ServerChannel } from "./server-channels";
import ServerMember from "./server-member";


interface ServerSidebarProps {
    serverId: string;
}

const ServerSidebar = async ({
    serverId
}: ServerSidebarProps) => {
    const profile = await currentProfile()

    if (!profile) {
        return auth().redirectToSignIn()
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: 'asc'
                }
            },
            members: {
                include: {
                    profile: true,
                },
                orderBy: {
                    role: 'asc'
                }
            }
        },
    })

    if (!server) {
        return redirect('/')
    }

    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT)
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO)
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO)
    const members = server?.members.filter((member) => member.profileId !== profile.id)
    const role = server?.members.find((member) => member.profileId === profile.id)?.role

    const roleIconMap = {
        [MemberRole.GUEST]: null,
        [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
        [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
    }

    const iconMap = {
        [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
        [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
        [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />
    }

    return (
        <>
            <div className="flex flex-col text-primary h-full w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
                <ServerHeaader server={server} role={role} />
                <ScrollArea className="flex-1 px-3">
                    <div className="mt-2">
                        <ServerSearch
                            data={[
                                {
                                    label: "Text Channels",
                                    type: 'channel',
                                    data: textChannels?.map((channel) => ({
                                        id: channel.id,
                                        name: channel.name,
                                        icon: iconMap[channel.type]
                                    }))
                                },
                                {
                                    label: "Voice Channels",
                                    type: 'channel',
                                    data: audioChannels?.map((channel) => ({
                                        id: channel.id,
                                        name: channel.name,
                                        icon: iconMap[channel.type]
                                    }))
                                },
                                {
                                    label: "Vidio Channels",
                                    type: 'channel',
                                    data: videoChannels?.map((channel) => ({
                                        id: channel.id,
                                        name: channel.name,
                                        icon: iconMap[channel.type]
                                    }))
                                },
                                {
                                    label: "Members",
                                    type: 'member',
                                    data: members?.map((member) => ({
                                        id: member.id,
                                        name: member.profile.name,
                                        icon: roleIconMap[member.role]
                                    }))
                                }
                            ]}
                        />
                    </div>
                    <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
                    <div className="space-y-[2px]">
                        {!!textChannels?.length && (
                            <div className="mb-2 ">
                                <ServerSection sectionType="channel" channelType={ChannelType.TEXT} role={role} label="Texts Channels" />
                                {textChannels.map((channel) => (
                                    <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="space-y-[2px]">
                        {!!audioChannels?.length && (
                            <div className="mb-2 ">
                                <ServerSection sectionType="channel" channelType={ChannelType.AUDIO} role={role} label="Voice Channels" />
                                {audioChannels.map((channel) => (
                                    <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="space-y-[2px]">
                        {!!videoChannels?.length && (
                            <div className="mb-2 ">
                                <ServerSection sectionType="channel" channelType={ChannelType.VIDEO} role={role} label="Video Channels" />
                                {videoChannels.map((channel) => (
                                    <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="space-y-[2px]">
                        {!!members?.length && (
                            <div className="mb-2 ">
                                <ServerSection sectionType='member' server={server} role={role} label="Members" />
                                {members.map((members) => (
                                    <ServerMember key={members.id} server={server} members={members} />
                                ))}
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </>
    );
}

export default ServerSidebar;