import { cn } from "@/lib/utils"

export type ChatMessage = {
  id: string
  role: "user" | "bot"
  content: string
}

export default function MessageBubble({
  role,
  content,
  isTyping,
}: {
  role: "user" | "bot"
  content: string
  isTyping?: boolean
}) {
  const isUser = role === "user"

  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
          // Use tokens for colors; user = primary, bot = accent
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-accent text-accent-foreground rounded-bl-sm",
        )}
        role="group"
        aria-label={isUser ? "User message" : "Bot message"}
      >
        {isTyping ? (
          <span className="opacity-70">Typing…</span>
        ) : (
          <span className="whitespace-pre-wrap">{content}</span>
        )}
      </div>
    </div>
  )
}
