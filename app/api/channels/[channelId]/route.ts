import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { channelId: string } }) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get('serverId');

        if (!profile) {
            return new NextResponse('unauthorized', { status: 401 });
        }

        if (!serverId) {
            return new NextResponse('serverId missing', { status: 400 });
        }

        if (!params.channelId) {
            return new NextResponse('channelId missing', { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                        },
                    },
                },
            },
            data: {
                channels: {
                    delete: {
                        id: params.channelId,
                        name: {
                            not: 'general',
                        },
                    },
                },
            },
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log(error);
        return new NextResponse('internal error', { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: { channelId: string } }) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get('serverId');
        const { name, type } = await req.json();

        if (!profile) {
            return new NextResponse('unauthorized', { status: 401 });
        }

        if (name === 'general') {
            return new NextResponse('general server cannot be modified', { status: 400 });
        }

        if (!serverId) {
            return new NextResponse('serverId missing', { status: 400 });
        }

        if (!params.channelId) {
            return new NextResponse('channelId missing', { status: 400 });
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
                        },
                    },
                },
            },
            data: {
                channels: {
                    update: {
                        where: {
                            id: params.channelId,
                            NOT: {
                                name: 'general',
                            },
                        },
                        data: {
                            name: name,
                            type: type,
                        },
                    },
                },
            },
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log(error);
        return new NextResponse('internal error', { status: 500 });
    }
}
