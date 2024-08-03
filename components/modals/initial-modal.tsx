'use client';
import * as z from 'zod';
import axios from 'axios'
import { Button } from "@/components/ui/button";
import { zodResolver } from '@hookform/resolvers/zod' 
import { useForm } from "react-hook-form";
import Fileupload from '@/components/fileupload'
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { useRouter } from 'next/navigation';



const formSchema = z.object({
    name: z.string().min(1, {
        message: "Server name is required."
    }),
    imageUrl: z.string().min(1, {
        message: "Server image is required."
    })
})


const InitialModal = () => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            imageUrl: ''
        }
    })
    
    
    
    const isLoading = form.formState.isSubmitting;
    const router = useRouter()
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post('/api/servers', values)

            form.reset()
            router.refresh()
            window.location.reload()
        } catch (error) {
            console.log(error)
        }
    }

    return ( 
        <Dialog open>
            <DialogContent className="bg-white text-black overflow-hidden p-0">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Create your server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Give your server a personality with a name and image. You can always change it later.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='space-y-8 px-6'>
                            <div className='flex items-center justify-center text-center'>
                                <FormField 
                                control={form.control}
                                name='imageUrl'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Fileupload 
                                              endpoint='serverImage'
                                              value={field.value}
                                              onChange={field.onChange} 
                                             />
                                        </FormControl>
                                    </FormItem>
                                )}
                                />
                            </div>
                            <FormField 
                                control={form.control} 
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                                            Server name
                                        </FormLabel>
                                        <FormControl>
                                            <Input disabled={isLoading} className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0' placeholder='Enter Server Name' {...field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className='bg-gray-100 px-6 py-4 '>
                            <Button disabled={isLoading} variant='primary'>
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default InitialModal;
