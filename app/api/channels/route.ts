import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { MemberRole } from "@prisma/client"
import { NextResponse } from "next/server"

export async function POST(req: Request){
    try {
        const profile = await currentProfile()
        const {searchParams} = new URL(req.url)
        const {name, type} = await req.json()

        const serverId = searchParams.get('serverId')

        if (!profile) {
            return new NextResponse("unauthorized request", {status: 401})
        }
        if (!serverId) {
            return new NextResponse("serverId not found", {status: 400})
        }

        if (name === "general") {
            return new NextResponse("Name cannot be general", {status: 400})
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members:{
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    create: {
                        name: name,
                        type: type,
                        profileId: profile.id,
                    }
                }
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log("chanel create error", error)
        return new NextResponse("internal error", {status: 500})
    }
}