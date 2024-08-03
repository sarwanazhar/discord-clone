import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import NavigationAction from './navigation-action';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import NavigationItem from '@/components/navigation/navigation-item';
import { ModeToggle } from '@/components/mode-toggle';
import { UserButton } from '@clerk/nextjs';

export default async function NavigationSidebar() {
    const profile = await currentProfile();
    if (!profile) {
        return redirect('/')
    }

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

  return (
    <div className='flex flex-col space-y-4 items-center h-full text-primary dark:bg-[#1E1F22] bg-[#E3E5E8] w-full py-3'>
        <NavigationAction />
        <Separator 
          className='h-[2px] dark:bg-zinc-700 bg-zinc-300 rounded-md w-10 mx-auto '
        />
        <ScrollArea className='flex-1 w-full'>
            {servers.map((server)=> (
                <div key={server.id} className='mb-4'>
                    <NavigationItem 
                      id={server.id}
                      name={server.serverName}
                      imageUrl={server.imageUrl}
                    />
                </div>
            ))}
        </ScrollArea>
        <div className='pb-3 mt-auto flex items-center flex-col gap-y-4'>
            <ModeToggle />
            <UserButton 
             afterSignOutUrl='/'
             appearance={{
                elements: {
                    avatarBox: "w-[48px] h-[48px]"
                }
             }}
            />
        </div>
    </div>
  )
}
