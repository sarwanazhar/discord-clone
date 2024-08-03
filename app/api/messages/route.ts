import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { Message } from "@prisma/client"
import { NextResponse } from "next/server"

const MESSAGE_BATCH = 10;

export async function GET (req : Request) {
    try {
        const profile = await currentProfile()
        const { searchParams } = new URL(req.url)
        const cursor = searchParams.get('cursor')
        const channelId = searchParams.get('channelId')


        if (!profile) {
            return new NextResponse('Unauthorized', {status: 401})
        }


        if (!channelId) {
            return new NextResponse('ChannelId missing', {status: 400})
        }

        let message: Message[] = [];

        if (cursor) {
            message = await db.message.findMany({
                take: MESSAGE_BATCH,
                skip: 1,
                cursor: {
                    id: cursor,
                },
                where: {
                    channelId: channelId,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
        } else {
            message = await db.message.findMany({
                take: MESSAGE_BATCH,
                where: {
                    channelId: channelId
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc',
                }
            })
        }

        let nextCursor = null;

        if (message.length === MESSAGE_BATCH) {
            nextCursor = message[MESSAGE_BATCH - 1].id
        }


        return NextResponse.json({
            items: message,
            nextCursor
        })

    } catch (error) {
        console.log('[message_get]', error)
        return new NextResponse("Internal error", {status: 500})
    }
}