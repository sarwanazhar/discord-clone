import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    {params}: {params: {serverId: string}}
){
    try {
        const profile = await currentProfile()

        if (!profile) {
            return auth().redirectToSignIn()
        }

        const {name, imageUrl} = await req.json()

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                serverName: name,
                imageUrl: imageUrl,
            }
        })

        return NextResponse.json(server)


    } catch (error) {
        console.log("Updating error",error)
        return new NextResponse("Internal Error", {status: 500})
    }
}