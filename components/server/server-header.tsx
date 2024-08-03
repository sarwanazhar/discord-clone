'use client'

import { serverWithProfileWithMembers } from "@/types";
import { MemberRole } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerHeaaderProps {
    server: serverWithProfileWithMembers;
    role?: MemberRole
}

const ServerHeaader = ({
    server,
    role
}: ServerHeaaderProps) => {
    const { onOpen } = useModal()

    const isAdmin = role === "ADMIN"
    const isModerator = role === "MODERATOR" || isAdmin


    return ( 
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="focus:outline-none">
                <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/10 transition">
                    {server.serverName}
                    <ChevronDown className="h-5 w-5 ml-auto"/>
                </button>   
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 text-sm font-medium text-black dark:text-neutral-400 space-y-[2px]">
                {isModerator && (
                    <DropdownMenuItem onClick={() => onOpen('invite', {server})} className="capitalize text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer">
                        invite people
                        <UserPlus className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem onClick={() =>  onOpen("editServer", {server})} className="capitalize px-3 py-2 text-sm cursor-pointer">
                        Server Settings
                        <Settings className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {isAdmin && (
                    <DropdownMenuItem onClick={() =>  onOpen("manageMember", {server})} className="capitalize px-3 py-2 text-sm cursor-pointer">
                        Manage Members
                        <Users className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <DropdownMenuItem onClick={() =>  onOpen("createChannel", {server})} className="capitalize px-3 py-2 text-sm cursor-pointer">
                        Create Channel
                        <PlusCircle className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {isModerator && (
                    <DropdownMenuSeparator />
                )}
                {isAdmin && (
                    <DropdownMenuItem onClick={() =>  onOpen("deleteServer", {server})}className="capitalize px-3 py-2 text-sm cursor-pointer text-rose-500">
                        Delete Server
                        <Trash className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {!isAdmin && (
                    <DropdownMenuItem onClick={() =>  onOpen("leaveServer", {server})} className="capitalize px-3 py-2 text-sm cursor-pointer text-rose-500">
                        Leave Server
                        <LogOut className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
     );
}
 
export default ServerHeaader   ;