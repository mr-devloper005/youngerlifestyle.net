'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth-context'
import { useToast } from '@/components/ui/use-toast'

export function LoginForm() {
  const { login, isLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password) {
      toast({
        title: 'Missing information',
        description: 'Enter your email and password to continue.',
        variant: 'destructive',
      })
      return
    }
    await login(email.trim(), password)
    toast({ title: 'Signed in', description: 'Welcome back.' })
    router.push('/')
    router.refresh()
  }

  return (
    <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="login-email" className="text-sm font-medium text-neutral-800">
          Email
        </Label>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          className="h-12 rounded-2xl border-neutral-200 bg-white px-4 text-neutral-950"
          placeholder="you@company.com"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="login-password" className="text-sm font-medium text-neutral-800">
          Password
        </Label>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          className="h-12 rounded-2xl border-neutral-200 bg-white px-4 text-neutral-950"
          placeholder="••••••••"
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="h-12 rounded-full bg-neutral-950 text-sm font-semibold text-white hover:bg-neutral-800"
      >
        {isLoading ? 'Signing in…' : 'Login'}
      </Button>
      <div className="flex items-center justify-between text-sm text-neutral-600">
        <Link href="/forgot-password" className="hover:text-neutral-950 hover:underline">
          Forgot password?
        </Link>
        <Link href="/register" className="inline-flex items-center gap-2 font-semibold text-neutral-950 hover:underline">
          <Sparkles className="h-4 w-4" />
          Create account
        </Link>
      </div>
    </form>
  )
}
