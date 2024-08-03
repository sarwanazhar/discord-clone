import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function DELETE(req:Request, {params}: {params: {serverId: string}}) {
    try {
        const profile = await currentProfile()

        if (!profile) {
            return new NextResponse("Unauthorized!", {status:401})
        }
        if(!params.serverId){
            return new NextResponse("ServerId Missing", {status: 400})
        }

        const server = await db.server.delete({
            where: {
                id: params.serverId,
                profileId: profile.id
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log("error deleting server", error)
        return new NextResponse("internal error", {status: 500})
    }
}

export async function PATCH(req: Request, {params}: {params: {serverId: string}}){
    try {
        const profile = await currentProfile()

        if (!profile) {
            return new NextResponse('Unauhtorized request', {status: 401})
        }

        if (!params.serverId) {
            return new NextResponse("ServerId missing", {status: 400})
        }

        const server = await db.server.update({
            where:{
                id: params.serverId,
                profileId:{
                    not: profile.id
                },
                members:{
                    some: {
                        profileId: profile.id
                    }
                }
            },
            data: {
                members: {
                    deleteMany: {
                        profileId: profile.id
                    }
                }
            }
        })

        return NextResponse.json(server)


    } catch (error) {
        console.log("serverID leave errror",error)
        return new NextResponse('internal server error', {status: 500})
    }
}