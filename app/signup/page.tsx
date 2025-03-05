"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gift } from "lucide-react"
import { initializeApp } from "firebase/app"
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, getDoc } from "firebase/auth"
import { getFirestore, doc, setDoc } from "firebase/firestore"
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
const db = getFirestore(app)
const googleProvider = new GoogleAuthProvider()

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { t } = useLanguage()

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Crear documento de usuario en Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name || email.split("@")[0],
        email: user.email,
        createdAt: new Date(),
      })

      // Esperar un momento antes de redirigir
      setTimeout(() => {
        router.push("/dashboard")
      }, 500)
    } catch (error: any) {
      console.error("Error en el registro con email:", error)

      // Mensajes de error más amigables
      if (error.code === "auth/email-already-in-use") {
        setError("Este email ya está en uso. Prueba con otro o inicia sesión.")
      } else if (error.code === "auth/weak-password") {
        setError("La contraseña es demasiado débil. Usa al menos 6 caracteres.")
      } else {
        setError(error.message || "Error al crear la cuenta")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    setError("")

    try {
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user

      // Verificar si el usuario existe antes de crear el documento
      const userDocRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        // Solo crear el documento si no existe
        await setDoc(userDocRef, {
          name: user.displayName || "Usuario",
          email: user.email,
          createdAt: new Date(),
        })
      }

      // Esperar un momento antes de redirigir para asegurar que los datos se guarden
      setTimeout(() => {
        router.push("/dashboard")
      }, 500)
    } catch (error: any) {
      console.error("Error en el registro con Google:", error)
      if (error.code === "auth/popup-closed-by-user") {
        setError("El popup de autenticación fue cerrado. Por favor, inténtalo de nuevo.")
      } else {
        setError(error.message || "Error al registrarse con Google")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Gift className="h-6 w-6 text-primary" />
              <span>WishMaker</span>
            </Link>
            <LanguageSelector />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            <ClientTranslation translationKey="createAccount" />
          </CardTitle>
          <CardDescription className="text-center">
            <ClientTranslation translationKey="enterInformation" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="bg-destructive/10 text-destructive text-sm p-2 rounded-md">{error}</div>}
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                <ClientTranslation translationKey="name" />
              </Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("creatingAccount") : t("signupWithEmail")}
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
          <Button variant="outline" type="button" className="w-full" onClick={handleGoogleSignUp} disabled={loading}>
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
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            <ClientTranslation translationKey="alreadyHaveAccount" />{" "}
            <Link href="/login" className="underline underline-offset-4 hover:text-primary">
              <ClientTranslation translationKey="login" />
            </Link>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

