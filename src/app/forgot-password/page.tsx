"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NavbarShell } from "@/components/shared/navbar-shell"
import { Footer } from "@/components/shared/footer"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsSubmitted(true)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <NavbarShell />
      <main className="mx-auto flex max-w-lg flex-col px-4 py-16 sm:px-6 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full"
        >
          <Link
            href="/login"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>

          {!isSubmitted ? (
            <div className="rounded-[1.75rem] border border-neutral-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.06)] sm:p-10">
              <h1 className="text-3xl font-bold tracking-tight text-neutral-950">Reset your password</h1>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                Enter the email tied to your workspace. We will send a reset link if the account exists.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-neutral-800">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 rounded-2xl border-neutral-200 pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="h-12 w-full rounded-full bg-neutral-950 text-sm font-semibold text-white hover:bg-neutral-800"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending…" : "Send reset link"}
                </Button>
              </form>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-[1.75rem] border border-neutral-200 bg-white p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.06)] sm:p-10"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-950">Check your inbox</h1>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                If <strong className="text-neutral-950">{email}</strong> matches an account, a reset link is on the way.
              </p>
              <Button asChild variant="outline" className="mt-8 h-11 w-full rounded-full border-neutral-200 font-semibold">
                <Link href="/login">Return to login</Link>
              </Button>
              <p className="mt-6 text-sm text-neutral-600">
                Wrong address?{" "}
                <button type="button" onClick={() => setIsSubmitted(false)} className="font-semibold text-neutral-950 underline-offset-4 hover:underline">
                  Try again
                </button>
              </p>
            </motion.div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
