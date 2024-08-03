import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { MemberRole } from "@prisma/client"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        // Get profile and request data
        const profile = await currentProfile()
        const { searchParams } = new URL(req.url)
        const { name, type } = await req.json()
        const channelId = searchParams.get('channelId')
        const serverId = searchParams.get('serverId')

        // Validate profile and parameters
        if (!profile) {
            return new NextResponse("Unauthorized request", { status: 401 })
        }
        if (!serverId) {
            return new NextResponse("ServerId not found", { status: 400 })
        }
        if (!channelId) {
            return new NextResponse("ChannelId not found", { status: 400 })
        }
        if (name === "general") {
            return new NextResponse("Name cannot be general", { status: 400 })
        }

        // Update server with new channel
        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
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
                        id: channelId, // Ensure this field is valid
                        name: name,
                        type: type,
                        profileId: profile.id,
                    }
                }
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.error("Channel creation error", error)
        return new NextResponse("Internal server error", { status: 500 })
    }
}
