"use client"

import * as React from "react"
import { AlertTriangle, Loader2, Mic, MicOff, Send, X } from "lucide-react"

import { useTamboVoice } from "@tambo-ai/react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { HAS_TAMBO_API_KEY } from "@/lib/config"
import { cn } from "@/lib/utils"

type VoiceInputProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string) => void
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
  onresult: ((event: unknown) => void) | null
  onerror: ((event: unknown) => void) | null
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
  const activeBackendRef = React.useRef<"speech" | "tambo" | null>(null)
  const voiceBaseValueRef = React.useRef("")

  const [speechSupported] = React.useState(
    () => typeof window !== "undefined" && Boolean(getSpeechRecognitionCtor())
  )
  const [mediaRecorderSupported] = React.useState(
    () => typeof window !== "undefined" && "MediaRecorder" in window
  )
  const [isSpeechListening, setIsSpeechListening] = React.useState(false)
  const [speechError, setSpeechError] = React.useState<string | null>(null)

  const voiceMode = React.useMemo<"speech" | "tambo" | "none">(() => {
    const tamboConfigured = HAS_TAMBO_API_KEY && mediaRecorderSupported
    const tamboHealthy = tamboConfigured && !mediaAccessError && !transcriptionError

    if (tamboHealthy) return "tambo"
    if (speechSupported) return "speech"
    if (tamboConfigured) return "tambo"
    return "none"
  }, [mediaAccessError, mediaRecorderSupported, speechSupported, transcriptionError])

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
      activeBackendRef.current = null
    }
  }, [])

  React.useEffect(() => {
    if (isSpeechListening || isRecording) return
    activeBackendRef.current = null
  }, [isRecording, isSpeechListening])

  const startSpeechRecognition = React.useCallback(() => {
    const SpeechRecognitionCtor = getSpeechRecognitionCtor()
    if (!SpeechRecognitionCtor) {
      setSpeechError("Speech recognition is not available in this browser.")
      return
    }

    const recognition = new SpeechRecognitionCtor()
    recognitionRef.current = recognition
    activeBackendRef.current = "speech"

    voiceBaseValueRef.current = value.trim()
    setSpeechError(null)
    setIsSpeechListening(true)

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onresult = (event) => {
      const normalizedEvent = event as
        | {
            results?: Array<{ isFinal: boolean; 0: { transcript: string } }>
            resultIndex?: number
          }
        | null

      const finalParts: string[] = []
      const interimParts: string[] = []

      const results = normalizedEvent?.results

      if (!results) return

      for (let i = normalizedEvent?.resultIndex ?? 0; i < results.length; i += 1) {
        const result = results[i]
        const transcriptValue = (result?.[0]?.transcript ?? "").trim()
        if (!transcriptValue) continue

        if (result.isFinal) {
          finalParts.push(transcriptValue)
        } else {
          interimParts.push(transcriptValue)
        }
      }

      const spoken = [...finalParts, ...interimParts].join(" ").replace(/\s+/g, " ").trim()
      const base = voiceBaseValueRef.current
      const combined = base ? `${base} ${spoken}`.trim() : spoken
      onChange(combined)
    }

    recognition.onerror = (event) => {
      const normalizedEvent = event as { error?: string } | null
      const errorMessage = normalizedEvent?.error

      setSpeechError(
        errorMessage ? `Speech recognition error: ${errorMessage}` : "Speech recognition error"
      )
      setIsSpeechListening(false)
      activeBackendRef.current = null
    }

    recognition.onend = () => {
      setIsSpeechListening(false)
      recognitionRef.current = null
      activeBackendRef.current = null
    }

    try {
      recognition.start()
    } catch (error) {
      setSpeechError(error instanceof Error ? error.message : "Unable to start speech recognition")
      setIsSpeechListening(false)
      recognitionRef.current = null
      activeBackendRef.current = null
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
      activeBackendRef.current = "tambo"
      startRecording()
    }
  }, [isBusy, startRecording, startSpeechRecognition, value, voiceMode])

  const stopVoice = React.useCallback(() => {
    let backendToStop = activeBackendRef.current

    if (!backendToStop) {
      if (isSpeechListening) backendToStop = "speech"
      else if (isRecording) backendToStop = "tambo"
    }

    if (backendToStop === "speech" && isSpeechListening) {
      stopSpeechRecognition()
      activeBackendRef.current = null
      return
    }

    if (backendToStop === "tambo" && isRecording) {
      stopRecording()
      activeBackendRef.current = null
      return
    }

    if (isSpeechListening) stopSpeechRecognition()
    if (isRecording) stopRecording()
    activeBackendRef.current = null
  }, [isRecording, isSpeechListening, stopRecording, stopSpeechRecognition])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return

    if (e.key !== "Enter") return
    if (e.shiftKey) return
    if (e.altKey || e.ctrlKey || e.metaKey) return

    e.preventDefault()

    const trimmed = value.trim()
    if (!trimmed) return
    if (isBusy || isListening) return

    onSubmit(trimmed)
  }

  const trimmedValue = value.trim()
  const canSubmit = Boolean(trimmedValue) && !isBusy && !isListening

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
                "h-12 w-full rounded-lg border border-light bg-tertiary px-4",
                "text-sm text-primary placeholder:text-tertiary",
                "transition-[border-color,box-shadow,transform] duration-200 ease-out focus:outline-none focus:border-accent-primary focus:shadow-md focus:scale-[1.01] motion-reduce:transition-none motion-reduce:transform-none",
                "disabled:cursor-not-allowed disabled:opacity-60",
                inputClassName
              )}
            />
          )}

          {!multiline && value && !isBusy && !isListening && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary transition-colors hover:text-primary"
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
          onClick={() => {
            if (!canSubmit) return
            onSubmit(trimmedValue)
          }}
          disabled={!canSubmit}
          aria-label="Send"
        >
          {isBusy ? <Loader2 className="animate-spin" /> : sendLabel ? sendLabel : <Send />}
        </Button>
      </div>

      {isListening ? (
        <div className="mt-3 rounded-lg border border-accent-info bg-tertiary p-3">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className="size-2 rounded-full bg-accent-info animate-pulse" />
              <div className="absolute size-2 rounded-full bg-accent-info animate-voice-input-ping" />
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
        <div className="mt-3 rounded-lg border border-accent-warning bg-tertiary p-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-4 text-accent-warning mt-0.5 shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-primary">Voice input is unavailable</p>
              <p className="mt-1 text-secondary">
                Try Chrome, Edge, or Safari, and confirm microphone permissions are allowed.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {speechError ? (
        <div className="mt-3 rounded-lg border border-accent-warning bg-tertiary p-3 text-xs">
          <div className="font-semibold text-primary">Voice input error</div>
          <div className="mt-1 text-secondary">{speechError}</div>
        </div>
      ) : null}

      {mediaAccessError ? (
        <div className="mt-3 rounded-lg border border-accent-warning bg-tertiary p-3 text-xs">
          <div className="font-semibold text-primary">Microphone access error</div>
          <div className="mt-1 text-secondary">{mediaAccessError}</div>
        </div>
      ) : null}

      {transcriptionError ? (
        <div className="mt-3 rounded-lg border border-accent-warning bg-tertiary p-3 text-xs">
          <div className="font-semibold text-primary">Transcription error</div>
          <div className="mt-1 text-secondary">{transcriptionError}</div>
        </div>
      ) : null}
    </div>
  )
}
