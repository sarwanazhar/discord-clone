import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function DELETE(req: Request, {params}: {params: {memberId: string}}){
    try {
        const profile = await currentProfile()
        const {searchParams} = new URL(req.url)
        const serverId = searchParams.get('server')


        if (!profile) {
            return new NextResponse("unauthorized request")
        }

        if (!params.memberId) {
            return new NextResponse("member id not found", {status: 401})
        }
        if (!serverId) {
            return new NextResponse("server id is missing", {status: 400})            
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                members: {
                    deleteMany: {
                        id: params.memberId,
                        profileId: {
                            not: profile.id
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: 'asc'
                    }
                }
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log('member kick error', error)
        return new NextResponse('internal error', {status: 500})
    }
}

export async function PATCH(req: Request, {params}: {params: {memberId: string}}){
    try {
        const profile = await currentProfile()
        const {searchParams} = new URL(req.url)
        const {role} = await req.json()

        const serverId = searchParams.get('server')

        if (!profile) {
            return new NextResponse("unauthorized request!", {status: 401})
        }

        if (!serverId) {
            return new NextResponse('serverId missing', {status: 400})
        }

        if (!params.memberId) {
            return new NextResponse("memberId missing", {status: 400})
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                   update: {
                    where: {
                        id: params.memberId,
                        profileId: {
                            not: profile.id
                        }
                    },
                    data: {
                        role: role
                    }
                   } 
                }
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: 'asc'
                    }
                }
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log("membersId patch error", error)
        return new NextResponse("internal error", {status: 500})
    }
}