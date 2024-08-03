import NavigationSidebar from "@/components/navigation/navigation-sidebar";
import { Toaster } from "@/components/ui/sonner";

const MainLayout = async ({children}: {children:React.ReactNode}) => {
    return ( 
        <div className="h-full">
            <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
                <NavigationSidebar />
            </div>
            <main className="md:pl-[72px] h-full">
                {children}
            </main>
            <Toaster/>
        </div>
     );
}
 
export default MainLayout;