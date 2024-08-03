import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import InitialModal from "@/components/modals/initial-modal";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

const SetupPage = async () => {
    const profile = initialProfile();

    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: (await profile).id
                }
            }
        }
    })

    if (server) {
        return redirect(`/servers/${server.id}`)
    }

    return ( 
        <>
            <SignedIn>
                <InitialModal />
            </SignedIn>
            <SignedOut>
                <RedirectToSignIn />
            </SignedOut>
        </>
     );
}
 
export default SetupPage;