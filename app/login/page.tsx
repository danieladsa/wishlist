"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gift } from "lucide-react"
import { initializeApp } from "firebase/app"
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { LanguageSelector } from "@/components/language-selector"
import ClientTranslation from "@/components/client-translation"
import { useLanguage } from "@/contexts/language-context"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDeWvx_9Ai8QUSCRVQ4iGHC8TOiwyPVJGk",
  authDomain: "wishlist-412c1.firebaseapp.com",
  projectId: "wishlist-412c1",
  storageBucket: "wishlist-412c1.firebasestorage.app",
  messagingSenderId: "644102663026",
  appId: "1:644102663026:web:ca61c329a5ad73c0bacbeb",
  measurementId: "G-EE7F5MYNW9",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { t } = useLanguage()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await signInWithEmailAndPassword(auth, email, password)
      setTimeout(() => router.push("/dashboard"), 500)
    } catch (error: any) {
      console.error("Error en el inicio de sesión con email:", error)
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        setError("Email o contraseña incorrectos. Verifica tus credenciales.")
      } else if (error.code === "auth/too-many-requests") {
        setError("Demasiados intentos fallidos. Inténtalo más tarde.")
      } else {
        setError(error.message || "Error al iniciar sesión.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError("")

    try {
      await signInWithPopup(auth, googleProvider)
      setTimeout(() => router.push("/dashboard"), 500)
    } catch (error: any) {
      console.error("Error en el inicio de sesión con Google:", error)
      if (error.code === "auth/popup-closed-by-user") {
        setError("El popup de autenticación fue cerrado. Inténtalo de nuevo.")
      } else {
        setError(error.message || "Error al iniciar sesión con Google.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
              <Gift className="h-6 w-6" />
              <span>WishMaker</span>
            </Link>
            <LanguageSelector />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-foreground">
            <ClientTranslation translationKey="login" />
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            <ClientTranslation translationKey="enterCredentials" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-2 rounded-md text-center">{error}</div>
          )}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                <ClientTranslation translationKey="email" />
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                <ClientTranslation translationKey="password" />
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-end">
              <Link href="/forgot-password" className="text-sm underline underline-offset-4 hover:text-primary">
                <ClientTranslation translationKey="forgotPassword" />
              </Link>
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={loading}>
              {loading ? t("loggingIn") : t("loginWithEmail")}
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                <ClientTranslation translationKey="continueWithGoogle" />
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            type="button"
            className="w-full border text-foreground hover:bg-primary hover:text-primary-foreground transition"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8" />
              <path d="M12 8v8" />
            </svg>
            Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

