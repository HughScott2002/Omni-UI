"use client";

import OmniInactiveDevelopment from "@/components/OmniInactiveDevelopment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronDown,
  CircleX,
  DoorClosed,
  EllipsisVertical,
  MessageSquare,
  Search,
  Phone,
  Video,
  Paperclip,
  Send,
  ImageIcon,
  Smile,
  FilePenLine,
} from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isAI?: boolean;
}

const messages: Message[] = [
  {
    id: "1",
    content: "Hello! How can I help you today?",
    sender: "Omni AI",
    timestamp: "08:23 AM",
    isAI: true,
  },
  {
    id: "2",
    content: "I need help with my account settings.",
    sender: "You",
    timestamp: "08:24 AM",
  },
  {
    id: "3",
    content:
      "I'd be happy to help you with your account settings. What specific aspect would you like to address?",
    sender: "Omni AI",
    timestamp: "08:24 AM",
    isAI: true,
  },
];

const recentConvos = [
  { name: "How to get your card", type: "pdf" },
  { name: "Do we do loans?", type: "pdf" },
  { name: "Suggestions for you", type: "docx" },
];

const MessageBubble = ({ message }: { message: Message }) => {
  return (
    <div
      className={cn(
        "flex w-full gap-3 mb-4",
        !message.isAI && "flex-row-reverse"
      )}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={
            message.isAI ? "/placeholder/ai.jpg" : "/placeholder/image 8.png"
          }
        />
        <AvatarFallback className="bg-omni-text-grey/20">
          {message.isAI ? "AI" : "You"}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-2",
          message.isAI ? "bg-omni-blue text-white" : "bg-gray-100"
        )}
      >
        <p className="text-sm">{message.content}</p>
        <span className="text-xs opacity-70 mt-1 block">
          {message.timestamp}
        </span>
      </div>
    </div>
  );
};

const page = () => {
  return (
    <section className="w-full h-full  overflow-hidden">
      <div className="size-full">
        <div className="size-full grid grid-cols-3 ">
          {/* Main Chat Area */}
          <div className="col-span-2 size-full border-y-2 border-l-2 border-gray-200">
            {/* Chat Header */}
            <div className="w-full h-20 flex items-center justify-between border-b-2 border-gray-200 px-6">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder/ai.jpg" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold text-omni-pitch-black">
                    Omni AI
                  </span>
                  <span className="text-sm text-omni-green">Online</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-omni-text-grey">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="px-2 mt-auto flex gap-1 rounded-lg justify-center items-center cursor-pointer">
                      <EllipsisVertical className="h-5 w-5 cursor-pointer hover:text-omni-blue" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="flex flex-col justify-center px-4 py-2 w-42 bg-omni-background-grey">
                    <DropdownMenuItem className="flex gap-2 p-2 items-center hover:px-2 hover:text-omni-blue">
                      {/* <FilePenLine className="size-4 " /> */}
                      <Phone className="h-5 w-5 cursor-pointer hover:text-omni-blue" />
                      <span className="text-sm font-normal">
                        Call Customer Service
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* <EllipsisVertical className="h-5 w-5 cursor-pointer hover:text-omni-blue" /> */}
              </div>
            </div>

            {/* Chat Messages */}
            <ScrollArea className="h-[calc(100vh-12rem)] w-full px-6 py-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </ScrollArea>

            {/* Chat Input */}
            <div className="absolute bottom-0 w-[93%]  border-t-2 border-gray-200 bg-white p-4">
              <div className="flex items-center gap-2 px-4">
                <Paperclip className="h-5 w-5 text-omni-text-grey cursor-pointer" />
                <ImageIcon className="h-5 w-5 text-omni-text-grey cursor-pointer" />
                <Input
                  placeholder="Type a message..."
                  className="flex-1 border-none bg-gray-50 focus-visible:ring-0"
                />
                <Smile className="h-5 w-5 text-omni-text-grey cursor-pointer" />
                <Send className="h-5 w-5 text-omni-blue cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-1 border-2 border-gray-200 ">
            {/* Sidebar Header */}
            <div className="w-full h-20 flex items-center justify-between px-6 border-b-2 border-gray-200">
              <Search className="h-5 w-5 text-omni-text-grey" />
              <CircleX className="h-5 w-5 text-omni-text-grey cursor-pointer" />
            </div>

            {/* Profile Section */}
            <div className="px-6 py-8">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src="/placeholder/ai.jpg" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <h2 className="font-bold text-lg text-omni-pitch-black">
                  Omni AI
                </h2>
                <span className="text-sm text-omni-text-grey">@omniAi</span>
              </div>
            </div>

            {/* Recent Conversations */}
            <div className="px-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-omni-pitch-black">
                  Recent Conversations
                </h3>
                <ChevronDown className="h-5 w-5 text-omni-text-grey cursor-pointer" />
              </div>
              <div className="space-y-4">
                {recentConvos.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <MessageSquare className="h-5 w-5 text-omni-blue" />
                    <span className="text-sm text-omni-text-grey">
                      {file.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
