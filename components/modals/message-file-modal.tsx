'use client';
import * as z from 'zod';
import axios from 'axios'
import { Button } from "@/components/ui/button";
import { zodResolver } from '@hookform/resolvers/zod' 
import { useForm } from "react-hook-form";
import Fileupload from '@/components/fileupload'
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
    FormField,
    FormItem,
} from '@/components/ui/form'
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';
import qs from 'query-string'



const formSchema = z.object({
    fileUrl: z.string().min(1, {
        message: "attachment is required."
    })
})


const MessageFileModal = () => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: ''
        }
    })
    
    
    
    const isLoading = form.formState.isSubmitting;
    const { isOpen, onClose, type, data } = useModal()
    const router = useRouter()
    const isModalOpen = isOpen && type === 'messageFile';
    const { apiUrl, query } = data;
    

    const handleClose = () => {
        form.reset()
        onClose()
    }
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || '',
                query: query,

            })
            await axios.post(url, {
                ...values,
                content: values.fileUrl,
            })

            form.reset()
            router.refresh()
            handleClose()
        } catch (error) {
            console.log(error)
        }
    }

    return ( 
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black overflow-hidden p-0">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Add an attachment
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Send a file as a message.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
                        <div className='space-y-8 px-6'>
                            <div className='flex items-center justify-center text-center'>
                                <FormField 
                                control={form.control}
                                name='fileUrl'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Fileupload 
                                              endpoint='messageFile'
                                              value={field.value}
                                              onChange={field.onChange} 
                                             />
                                        </FormControl>
                                    </FormItem>
                                )}
                                />
                            </div>
                        </div>
                        <DialogFooter className='bg-gray-100 px-6 py-4 '>
                            <Button disabled={isLoading} variant='primary'>
                                Send
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default MessageFileModal;
