"use client"

import * as React from "react"
import { MessageSquare, Send, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  codeBlock?: {
    language: string
    code: string
    version?: string
  }
}

interface ChatInterfaceProps {
  onClose?: () => void
  isPage?: boolean
}

export function ChatInterface({ onClose, isPage = false }: ChatInterfaceProps) {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [input, setInput] = React.useState("")
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Agregar mensaje del usuario
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simular respuesta de la IA después de 1 segundo
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "He modificado el código para resolver el problema que estabas enfrentando. En lugar de usar la declaración `using namespace std;`, he prefijado explícitamente cada instancia de `cin`, `cout` y `endl` con `std::`.",
        role: "assistant",
        timestamp: new Date(),
        codeBlock: {
          language: "C++",
          code: "std::cin >> x;\nstd::cout << x << std::endl;",
          version: "Version 3"
        }
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  return (
    <div className={`flex flex-col ${isPage ? 'h-screen' : 'h-full'} bg-[#1E1E1E] relative`}>
      <div className="flex items-center justify-between p-4 border-b border-[#2D2D2D]">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-[#CCCCCC]" />
          <h2 className="text-lg font-semibold text-[#CCCCCC]">Chat</h2>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="text-[#CCCCCC] hover:bg-[#2D2D2D]">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-6 pb-24">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-4 ${message.role === "user"
                    ? "bg-[#2D2D2D] text-[#CCCCCC]"
                    : "bg-[#2D2D2D] text-[#CCCCCC]"
                  }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                {message.codeBlock && (
                  <div className="mt-3 rounded-md bg-[#1E1E1E] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#858585]">
                        {message.codeBlock.language}
                      </span>
                      {message.codeBlock.version && (
                        <span className="text-xs text-[#858585]">
                          {message.codeBlock.version}
                        </span>
                      )}
                    </div>
                    <pre className="text-sm font-mono text-[#CCCCCC] whitespace-pre-wrap">
                      {message.codeBlock.code}
                    </pre>
                  </div>
                )}
                <p className="text-xs text-[#858585] mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center px-4">
        <form onSubmit={handleSubmit} className="w-[60%] relative">
          <div className="flex gap-2 bg-[#2D2D2D] rounded-lg p-2 shadow-lg border border-[#CD5C5C] focus-within:border-[#CD5C5C]/70">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="text-[#858585] hover:text-[#CCCCCC] hover:bg-[#3E3E3E]"
            >
              <Plus className="h-5 w-5" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Reply to Claude..."
              className="flex-1 bg-transparent border-0 focus:ring-0 text-[#CCCCCC] placeholder-[#858585] text-sm"
            />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="text-[#858585] hover:text-[#CCCCCC] hover:bg-[#3E3E3E]"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 