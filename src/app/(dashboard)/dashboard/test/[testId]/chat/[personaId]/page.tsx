'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Send, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'

export default function PersonaChatPage() {
  const params = useParams()
  const router = useRouter()
  const [persona, setPersona] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadPersona()
    loadMessages()
  }, [params.personaId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadPersona = async () => {
    try {
      const res = await fetch(`/api/test/${params.testId}/personas/${params.personaId}`)
      const data = await res.json()
      setPersona(data.persona)
    } catch (error) {
      console.error('Failed to load persona')
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async () => {
    try {
      const res = await fetch(`/api/test/${params.testId}/personas/${params.personaId}/chat/history`)
      const data = await res.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Failed to load messages')
    }
  }

  const handleSend = async () => {
    if (!input.trim() || sending) return

    const userMessage = { role: 'user', content: input }
    setMessages([...messages, userMessage])
    setInput('')
    setSending(true)

    try {
      const res = await fetch(`/api/test/${params.testId}/personas/${params.personaId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, conversationHistory: messages }),
      })
      
      const data = await res.json()
      
      const assistantMessage = { role: 'assistant', content: data.response }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </DashboardLayout>
    )
  }

  if (!persona) {
    return <DashboardLayout><div>Persona not found</div></DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 py-4 px-4 border-b border-light-border-primary dark:border-dark-border-primary">
          <button
            onClick={() => router.push(`/dashboard/test/${params.testId}/results`)}
            className="p-2 rounded-lg hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-3 flex-1">
            <div className="text-4xl">{persona.avatar}</div>
            <div>
              <h2 className="font-semibold text-lg text-light-text-primary dark:text-dark-text-primary">
                {persona.name}
              </h2>
              <p className="text-sm text-light-text-tertiary dark:text-dark-text-tertiary">
                {persona.archetype}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary-500" />
              <h3 className="text-xl font-semibold mb-2">Start a conversation</h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary">
                Ask {persona.name} about their needs, concerns, or preferences
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-4 ${
                  msg.role === 'user'
                    ? 'bg-primary-500 text-white'
                    : 'bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary'
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}

          {sending && (
            <div className="flex justify-start">
              <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg p-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-light-border-primary dark:border-dark-border-primary">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Ask ${persona.name} a question...`}
              disabled={sending}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              icon={<Send className="h-5 w-5" />}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
