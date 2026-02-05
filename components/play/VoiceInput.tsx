"use client"

import * as React from "react"
import { AlertTriangle, Loader2, Mic, MicOff, Send, X } from "lucide-react"

import { useTamboVoice } from "@tambo-ai/react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type VoiceInputProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
  placeholder?: string
  multiline?: boolean
  className?: string
  inputClassName?: string
  sendLabel?: string
}

type SpeechRecognitionLike = {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  onresult: ((event: any) => void) | null
  onerror: ((event: any) => void) | null
  onend: (() => void) | null
}

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null

  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike
    webkitSpeechRecognition?: new () => SpeechRecognitionLike
  }

  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export function VoiceInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder,
  multiline = false,
  className,
  inputClassName,
  sendLabel,
}: VoiceInputProps) {
  const {
    startRecording,
    stopRecording,
    isRecording,
    isTranscribing,
    transcript,
    transcriptionError,
    mediaAccessError,
  } = useTamboVoice()

  const recognitionRef = React.useRef<SpeechRecognitionLike | null>(null)
  const voiceBaseValueRef = React.useRef("")

  const [speechSupported, setSpeechSupported] = React.useState(false)
  const [mediaRecorderSupported, setMediaRecorderSupported] = React.useState(false)
  const [isSpeechListening, setIsSpeechListening] = React.useState(false)
  const [speechError, setSpeechError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setSpeechSupported(Boolean(getSpeechRecognitionCtor()))
    setMediaRecorderSupported(typeof window !== "undefined" && "MediaRecorder" in window)
  }, [])

  const hasTamboApiKey = Boolean(process.env.NEXT_PUBLIC_TAMBO_API_KEY)
  const voiceMode = speechSupported ? "speech" : hasTamboApiKey && mediaRecorderSupported ? "tambo" : "none"
  const isListening = isSpeechListening || isRecording
  const isBusy = disabled || isTranscribing

  React.useEffect(() => {
    if (!transcript) return
    if (voiceMode !== "tambo") return

    const combined = [voiceBaseValueRef.current, transcript]
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim()

    onChange(combined)
  }, [onChange, transcript, voiceMode])

  React.useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
      recognitionRef.current = null
    }
  }, [])

  const startSpeechRecognition = React.useCallback(() => {
    const SpeechRecognitionCtor = getSpeechRecognitionCtor()
    if (!SpeechRecognitionCtor) {
      setSpeechError("Speech recognition is not available in this browser.")
      return
    }

    const recognition = new SpeechRecognitionCtor()
    recognitionRef.current = recognition

    voiceBaseValueRef.current = value.trim()
    setSpeechError(null)
    setIsSpeechListening(true)

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onresult = (event) => {
      let finalText = ""
      let interimText = ""

      const results = event?.results as Array<{ isFinal: boolean; 0: { transcript: string } }> | undefined

      if (!results) return

      for (let i = event.resultIndex ?? 0; i < results.length; i += 1) {
        const result = results[i]
        const transcriptValue = result?.[0]?.transcript ?? ""
        if (!transcriptValue) continue

        if (result.isFinal) {
          finalText += transcriptValue
        } else {
          interimText += transcriptValue
        }
      }

      const spoken = `${finalText}${interimText}`.replace(/\s+/g, " ").trim()
      const base = voiceBaseValueRef.current
      const combined = base ? `${base} ${spoken}`.trim() : spoken
      onChange(combined)
    }

    recognition.onerror = (event) => {
      setSpeechError(event?.error ? `Speech recognition error: ${event.error}` : "Speech recognition error")
      setIsSpeechListening(false)
    }

    recognition.onend = () => {
      setIsSpeechListening(false)
      recognitionRef.current = null
    }

    try {
      recognition.start()
    } catch (error) {
      setSpeechError(error instanceof Error ? error.message : "Unable to start speech recognition")
      setIsSpeechListening(false)
      recognitionRef.current = null
    }
  }, [onChange, value])

  const stopSpeechRecognition = React.useCallback(() => {
    recognitionRef.current?.stop()
  }, [])

  const startVoice = React.useCallback(() => {
    if (isBusy) return

    voiceBaseValueRef.current = value.trim()

    if (voiceMode === "speech") {
      startSpeechRecognition()
      return
    }

    if (voiceMode === "tambo") {
      startRecording()
    }
  }, [isBusy, startRecording, startSpeechRecognition, value, voiceMode])

  const stopVoice = React.useCallback(() => {
    if (voiceMode === "speech") {
      stopSpeechRecognition()
      return
    }

    if (voiceMode === "tambo") {
      stopRecording()
    }
  }, [stopRecording, stopSpeechRecognition, voiceMode])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const isPlainEnter =
      e.key === "Enter" && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey

    if (!isPlainEnter) return
    if (multiline && e.shiftKey) return
    if (e.nativeEvent.isComposing) return

    e.preventDefault()
    if (!isBusy && !isListening && value.trim()) onSubmit()
  }

  const canSubmit = Boolean(value.trim()) && !isBusy && !isListening

  return (
    <div className={className}>
      <div className={cn("flex items-end gap-3", multiline ? "items-end" : "items-center")}> 
        <div className="relative flex-1">
          {multiline ? (
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={isListening ? "Listening…" : placeholder}
              disabled={isBusy || isListening}
              className={cn("min-h-12", inputClassName)}
            />
          ) : (
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={isListening ? "Listening…" : placeholder}
              disabled={isBusy || isListening}
              className={cn(
                "h-12 w-full rounded-lg border-2 border-light bg-primary px-4",
                "text-sm text-primary placeholder:text-tertiary",
                "focus:outline-none focus:border-accent-primary",
                "disabled:cursor-not-allowed disabled:opacity-60",
                inputClassName
              )}
            />
          )}

          {value && !isBusy && !isListening && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary"
              aria-label="Clear input"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {voiceMode !== "none" ? (
          <Button
            type="button"
            variant={isListening ? "destructive" : "outline"}
            size="icon-lg"
            onClick={isListening ? stopVoice : startVoice}
            disabled={isBusy}
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
          >
            {isListening ? <MicOff /> : <Mic />}
          </Button>
        ) : null}

        <Button
          type="button"
          size={sendLabel ? "default" : "icon-lg"}
          onClick={onSubmit}
          disabled={!canSubmit}
          aria-label="Send"
        >
          {isBusy ? <Loader2 className="animate-spin" /> : sendLabel ? sendLabel : <Send />}
        </Button>
      </div>

      {isListening ? (
        <div className="mt-3 rounded-lg border-2 border-accent-danger bg-tertiary p-3">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className="size-2 rounded-full bg-accent-danger animate-pulse" />
              <div className="absolute size-2 rounded-full bg-accent-danger animate-voice-ping" />
            </div>
            <div>
              <p className="text-xs font-semibold text-primary">Listening…</p>
              <p className="text-xs text-secondary">
                {voiceMode === "speech"
                  ? "Speak clearly into your microphone"
                  : "Recording audio for transcription"}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {voiceMode === "none" ? (
        <div className="mt-3 rounded-lg border-2 border-accent-warning bg-tertiary p-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-4 text-accent-warning mt-0.5 shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-primary">Voice input is unavailable</p>
              <p className="mt-1 text-secondary">
                Enable speech recognition in your browser, or set `NEXT_PUBLIC_TAMBO_API_KEY` to
                use server-backed transcription.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {speechError ? (
        <div className="mt-3 rounded-lg border-2 border-accent-warning bg-tertiary p-3 text-xs">
          <div className="font-semibold text-primary">Voice input error</div>
          <div className="mt-1 text-secondary">{speechError}</div>
        </div>
      ) : null}

      {mediaAccessError ? (
        <div className="mt-3 rounded-lg border-2 border-accent-warning bg-tertiary p-3 text-xs">
          <div className="font-semibold text-primary">Microphone access error</div>
          <div className="mt-1 text-secondary">{mediaAccessError}</div>
        </div>
      ) : null}

      {transcriptionError ? (
        <div className="mt-3 rounded-lg border-2 border-accent-warning bg-tertiary p-3 text-xs">
          <div className="font-semibold text-primary">Transcription error</div>
          <div className="mt-1 text-secondary">{transcriptionError}</div>
        </div>
      ) : null}
    </div>
  )
}
