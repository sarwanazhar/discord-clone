import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid'
import { MemberRole } from "@prisma/client";

export async function POST(req:Request){
    try {
        const {name, imageUrl} = await req.json()
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized Request", {status: 500})
        }

        const server = await db.server.create({
            data: {
                profileId: profile.id,
                serverName: name,
                imageUrl: imageUrl,
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        {name:"general", profileId: profile.id}
                    ]
                },
                members: {
                    create: [
                        {profileId: profile.id, role: MemberRole.ADMIN}
                    ]
                }
            }
        })

         return NextResponse.json(server)
    } catch (error) {
        console.log("server api error", error)
        return new NextResponse("Internal error", {status: 500} )
    }
}