import { useEffect, useRef, useState } from 'react'
import './ConciergeChat.css'
import { askConcierge, type ConciergeRecommendation } from '../../services/conciergeChat'

type Message = {
  id: string
  role: 'guest' | 'concierge'
  text: string
  recommendations?: ConciergeRecommendation[]
  note?: string
  followUp?: string
  failed?: boolean
}

const openers = [
  'Where should we go for a quiet first evening?',
  'When is the best time for the Hill Country?',
  'Which places feel genuinely private?',
]

const WELCOME: Message = {
  id: 'welcome',
  role: 'concierge',
  text: 'Good day. I am your private concierge. Tell me who is travelling and what you would like Sri Lanka to feel like, and I will suggest where to begin.',
}

let messageCounter = 0
const nextId = () => `m${(messageCounter += 1)}`

export function ConciergeChat({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [draft, setDraft] = useState('')
  const [isSending, setIsSending] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Keep the newest message in view as the conversation grows.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, isSending])

  useEffect(() => {
    if (open) {
      // Let the panel paint before focusing, so the transition stays smooth.
      const timer = window.setTimeout(() => inputRef.current?.focus(), 220)
      return () => window.clearTimeout(timer)
    }

    // Closing the panel abandons any request still in flight.
    abortRef.current?.abort()
    abortRef.current = null
    setIsSending(false)
    return undefined
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  const send = async (text: string) => {
    const question = text.trim()
    if (!question || isSending) return

    setMessages((current) => [...current, { id: nextId(), role: 'guest', text: question }])
    setDraft('')
    setIsSending(true)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const reply = await askConcierge(question, { signal: controller.signal })

      setMessages((current) => [
        ...current,
        {
          id: nextId(),
          role: 'concierge',
          text: reply.narrative || 'I am not certain how best to answer that. Could you tell me a little more?',
          recommendations: reply.recommendations,
          note: reply.tailoredNote,
          followUp: reply.followUpQuestion,
        },
      ])
    } catch (error) {
      if ((error as Error).name === 'AbortError') return

      setMessages((current) => [
        ...current,
        {
          id: nextId(),
          role: 'concierge',
          failed: true,
          text: 'I could not reach the desk just now. Please try again in a moment, or speak with us on WhatsApp.',
        },
      ])
    } finally {
      abortRef.current = null
      setIsSending(false)
    }
  }

  return (
    <>
      <div
        className={`cchat-scrim${open ? ' is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <section
        className={`cchat${open ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="false"
        aria-label="AI Concierge"
        aria-hidden={!open}
      >
        <header className="cchat-head">
          <span className="cchat-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" focusable="false">
              <path d="M16 3.5 18.14 11 25.5 13.14 18.14 15.28 16 22.5 13.86 15.28 6.5 13.14 13.86 11 16 3.5Z" />
            </svg>
          </span>
          <div className="cchat-title">
            <strong>Private Concierge</strong>
            <span>Royale Isles Lanka</span>
          </div>
          <button type="button" className="cchat-close" onClick={onClose} aria-label="Close concierge">
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <div className="cchat-scroll" ref={scrollRef}>
          {messages.map((message) => (
            <div key={message.id} className={`cchat-row cchat-row--${message.role}`}>
              <div className={`cchat-bubble${message.failed ? ' is-failed' : ''}`}>
                {message.text.split('\n').filter(Boolean).map((line, index) => (
                  <p key={index}>{line}</p>
                ))}

                {message.recommendations && message.recommendations.length > 0 ? (
                  <ul className="cchat-recs">
                    {message.recommendations.slice(0, 3).map((rec, index) => (
                      <li key={`${rec.name ?? 'rec'}-${index}`}>
                        {rec.image ? <img src={rec.image} alt="" loading="lazy" /> : null}
                        <span>
                          <strong>{rec.name}</strong>
                          {rec.region ? <em>{rec.region}</em> : null}
                          {rec.description ? <span>{rec.description}</span> : null}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {message.note ? <p className="cchat-note">{message.note}</p> : null}

                {message.followUp ? (
                  <button
                    type="button"
                    className="cchat-followup"
                    onClick={() => void send(message.followUp as string)}
                  >
                    {message.followUp}
                  </button>
                ) : null}
              </div>
            </div>
          ))}

          {isSending ? (
            <div className="cchat-row cchat-row--concierge">
              <div className="cchat-bubble cchat-typing" aria-label="Concierge is replying">
                <span />
                <span />
                <span />
              </div>
            </div>
          ) : null}
        </div>

        {messages.length === 1 ? (
          <div className="cchat-openers">
            {openers.map((opener) => (
              <button key={opener} type="button" onClick={() => void send(opener)}>
                {opener}
              </button>
            ))}
          </div>
        ) : null}

        <form
          className="cchat-compose"
          onSubmit={(event) => {
            event.preventDefault()
            void send(draft)
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={draft}
            placeholder="Ask about places, timing, or privacy…"
            aria-label="Message the concierge"
            onChange={(event) => setDraft(event.target.value)}
            disabled={isSending}
          />
          <button type="submit" aria-label="Send" disabled={isSending || draft.trim().length === 0}>
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M4 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </form>

        <p className="cchat-disclaimer">
          Suggestions are AI-generated and confirmed by your concierge before anything is booked.
        </p>
      </section>
    </>
  )
}
