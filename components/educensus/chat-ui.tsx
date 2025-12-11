"use client"

import type React from "react"
import axios from "axios"


import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import useSWRMutation from "swr/mutation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import MessageBubble, { type ChatMessage } from "./message-bubble"

type Language = "en" | "kn"

async function askFetcher(url: string, { arg }: { arg: { query: string; language: Language } }) {
  try {
    const response = await axios.post(url, arg, {
      headers: { "Content-Type": "application/json" },
      timeout: Number(process.env.NEXT_PUBLIC_FETCH_TIMEOUT ?? 30_000),
    })
    return response.data as { reply: string }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || error.message || "Unknown error occurred")
    } else {
      throw new Error("An unexpected error occurred")
    }
  }
}

const QUICK_QUESTIONS = ["How to log in?", "Update student data", "Forgot password", "Last submission date"]

export default function ChatUI() {
  const [language, setLanguage] = useState<Language>("en")
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      role: "bot",
      content:
        "Hello! I’m EduCensusBot. I can help with login, data entry, deadlines, and updates for the Karnataka Census website.",
    },
  ])

  const scrollRef = useRef<HTMLDivElement>(null)

  const { trigger, isMutating } = useSWRMutation("/api/ask", askFetcher)

  const canSend = useMemo(() => input.trim().length > 0 && !isMutating, [input, isMutating])

  useEffect(() => {
    // Scroll to bottom on new messages
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  const sendMessage = useCallback(
    async (text?: string) => {
      const content = (text ?? input).trim()
      if (!content) return
      // append user message
      const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content }
      setMessages((prev) => [...prev, userMsg])
      setInput("")

      try {
        const { reply } = await trigger({ query: content, language })
        const botMsg: ChatMessage = { id: crypto.randomUUID(), role: "bot", content: reply }
        setMessages((prev) => [...prev, botMsg])
      } catch (e) {
        const botMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "bot",
          content: `Sorry, I couldn't fetch a response right now. Details: ${e instanceof Error ? e.message : String(e)}`,
        }
        setMessages((prev) => [...prev, botMsg])
      }
    },
    [input, language, trigger],
  )

  const onQuickAsk = useCallback(
    (q: string) => {
      void sendMessage(q)
    },
    [sendMessage],
  )

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        if (canSend) void sendMessage()
      }
    },
    [canSend, sendMessage],
  )

  return (
    <div className="mx-auto max-w-5xl px-4 py-4 md:py-6">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4 md:gap-6">
        {/* Chat area */}
        <div className="flex flex-col h-[70vh] md:h-[72vh] rounded-lg border bg-card">
          {/* Toolbar: Language toggle */}
          <div className="flex items-center justify-between px-3 py-2 border-b bg-secondary rounded-t-lg">
            <span className="text-sm text-muted-foreground">Language</span>
            <div className="flex items-center gap-2" role="group" aria-label="Language selection">
              <Button
                variant={language === "en" ? "default" : "secondary"}
                size="sm"
                onClick={() => setLanguage("en")}
                aria-pressed={language === "en"}
              >
                English
              </Button>
              <Button
                variant={language === "kn" ? "default" : "secondary"}
                size="sm"
                onClick={() => setLanguage("kn")}
                aria-pressed={language === "kn"}
              >
                Kannada
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-3 py-3 md:px-4 md:py-4 space-y-3"
            aria-live="polite"
          >
            {messages.map((m) => (
              <MessageBubble key={m.id} role={m.role} content={m.content} />
            ))}
            {isMutating ? <MessageBubble role="bot" content="Typing…" isTyping /> : null}
          </div>

          {/* Input area */}
          <div className="border-t p-2 md:p-3 rounded-b-lg">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={cn(
                  "inline-flex items-center justify-center h-10 w-10 rounded-md border bg-secondary text-secondary-foreground hover:bg-accent transition",
                )}
                aria-label="Voice input (placeholder)"
                title="Voice input (placeholder)"
              >
                {/* Microphone icon (inline SVG) */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Z" />
                  <path d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V21H8a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2h-3v-3.08A7 7 0 0 0 19 11Z" />
                </svg>
              </button>

              <Input
                placeholder="Type your question here…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                aria-label="Question input"
              />

              <Button onClick={() => void sendMessage()} disabled={!canSend} aria-label="Send message" title="Send">
                {/* Send icon (inline SVG) */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  className="-ml-0.5 mr-1"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2 .01 7Z" />
                </svg>
                Send
              </Button>
            </div>

            {/* Mobile quick questions panel */}
            <div className="mt-2 grid grid-cols-2 gap-2 md:hidden">
              {QUICK_QUESTIONS.map((q) => (
                <Button key={q} variant="secondary" onClick={() => onQuickAsk(q)} className="justify-start">
                  {q}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar quick questions (desktop) */}
        <aside className="hidden md:block">
          <div className="h-[72vh] rounded-lg border bg-card p-3 space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">Quick questions</h2>
            <div className="grid gap-2">
              {QUICK_QUESTIONS.map((q) => (
                <Button key={q} variant="secondary" className="justify-start" onClick={() => onQuickAsk(q)}>
                  {q}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground pt-2">Tip: Press Enter to send, Shift+Enter for a new line.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
