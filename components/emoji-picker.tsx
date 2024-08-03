'use client'

import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import Picker from '@emoji-mart/react';
import Data from '@emoji-mart/data';
import { useTheme } from "next-themes";
import { Smile } from "lucide-react";

interface EmojiPickerProps {
    onChange: (value: string) => void;
}

export const EmojiPicker = ({
    onChange
}: EmojiPickerProps) => {
    const { resolvedTheme } = useTheme()


    return (
        <Popover>
            <PopoverTrigger>
                <Smile className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"/>
            </PopoverTrigger>
            <PopoverContent className="bg-transparent border-none shadow-none drop-shadow-none mb-16" side="right" sideOffset={40}>
            <Picker
                    theme={resolvedTheme}
                    data={Data}
                    onEmojiSelect={(emoji: any) => onChange(emoji.native)}
                 />
            </PopoverContent>
        </Popover>
    )
}