"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Gift, ExternalLink, Share2, Check, X, ShoppingBag } from "lucide-react"
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore, collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore"
import { LanguageSelector } from "@/components/language-selector"
import ClientTranslation from "@/components/client-translation"
import { useLanguage } from "@/contexts/language-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

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

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

interface WishlistItem {
  id: string
  name: string
  link: string
  description: string
  reserved?: boolean
  reservedBy?: string
  reservationId?: string
}

interface User {
  name: string
  email: string
}

export default function PublicWishlist({ params }: { params: { userId: string; userName: string } }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [reservationName, setReservationName] = useState("")
  const [selectedItem, setSelectedItem] = useState<WishlistItem | null>(null)
  const [reservationLoading, setReservationLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [reservationId, setReservationId] = useState<string | null>(null)
  const { t } = useLanguage()
  const firstName = decodeURIComponent(params.userName).split(" ")[0]

  // Generar un ID único para el visitante si no existe
  useEffect(() => {
    const storedId = localStorage.getItem("visitorId")
    if (!storedId) {
      const newId = Math.random().toString(36).substring(2, 15)
      localStorage.setItem("visitorId", newId)
      setReservationId(newId)
    } else {
      setReservationId(storedId)
    }

    // Intentar recuperar el nombre guardado
    const storedName = localStorage.getItem("visitorName")
    if (storedName) {
      setReservationName(storedName)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Obtener los elementos de la lista de deseos basándonos en el userId de los parámetros de la URL
        const userIdFromUrl = params.userId

        // Consulta a Firestore para obtener los items cuyo userId coincida con el userId de la URL
        const q = query(collection(db, "wishlistItems"), where("userId", "==", userIdFromUrl))
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
          console.log("No wishlist items found for this user.")
        } else {
          const items: WishlistItem[] = []
          querySnapshot.forEach((doc) => {
            items.push({
              id: doc.id,
              ...doc.data(),
            } as WishlistItem)
          })

          console.log("Fetched wishlist items:", items) // Verifica los items obtenidos
          setWishlistItems(items)
        }

        // Obtener el usuario (sin mostrar el error si no se encuentra)
        const userDoc = await getDoc(doc(db, "users", userIdFromUrl))
        if (userDoc.exists()) {
          setUser(userDoc.data() as User)
        } else {
          // Si el usuario no se encuentra en Firestore, no hacemos nada y no mostramos el error
          setUser(null) // O bien puedes dejarlo como null si no quieres mostrar nada
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.userId]) // Re-ejecutar cuando cambie el `userId` en los parámetros

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    alert(t("copied"))
  }

  const handleReserveItem = async (item: WishlistItem) => {
    if (!reservationId) return

    setSelectedItem(item)

    // Si el item ya está reservado por este usuario, quitamos la reserva
    if (item.reserved && item.reservationId === reservationId) {
      try {
        setReservationLoading(true)
        await updateDoc(doc(db, "wishlistItems", item.id), {
          reserved: false,
          reservedBy: null,
          reservationId: null,
        })

        // Actualizar el estado local
        setWishlistItems(
          wishlistItems.map((i) =>
            i.id === item.id ? { ...i, reserved: false, reservedBy: undefined, reservationId: undefined } : i,
          ),
        )

        alert(t("reservationRemoved"))
      } catch (error) {
        console.error("Error removing reservation:", error)
      } finally {
        setReservationLoading(false)
      }
    }
    // Si el item ya está reservado por otro usuario, mostramos un mensaje
    else if (item.reserved) {
      alert(`${t("alreadyReserved")} ${item.reservedBy}`)
    }
    // Si el item no está reservado, abrimos el diálogo para reservarlo
    else {
      setDialogOpen(true)
    }
  }

  const confirmReservation = async () => {
    if (!selectedItem || !reservationId || !reservationName) return

    try {
      setReservationLoading(true)

      // Guardar el nombre para futuras reservas
      localStorage.setItem("visitorName", reservationName)

      await updateDoc(doc(db, "wishlistItems", selectedItem.id), {
        reserved: true,
        reservedBy: reservationName,
        reservationId: reservationId,
      })

      // Actualizar el estado local
      setWishlistItems(
        wishlistItems.map((i) =>
          i.id === selectedItem.id ? { ...i, reserved: true, reservedBy: reservationName, reservationId } : i,
        ),
      )

      setDialogOpen(false)
      alert(t("reservationSuccess"))
    } catch (error) {
      console.error("Error reserving item:", error)
    } finally {
      setReservationLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">
          <ClientTranslation translationKey="loading" />
        </p>
      </div>
    )
  }

  if (!wishlistItems) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Wishlist not found</h1>
          <p className="mt-2 text-muted-foreground">This wishlist doesn't exist or has been removed.</p>
          <Link href="/">
            <Button className="mt-4">Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Gift className="h-6 w-6 text-primary" />
          <span className="text-primary">WishMaker</span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            <ClientTranslation translationKey="share" />
          </Button>
        </div>
      </header>
      <main className="flex-1 container max-w-5xl py-8 px-4">
        <div className="grid gap-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">
              <ClientTranslation translationKey="birthdayWishlist" /> {firstName}
            </h1>
            <p className="text-muted-foreground">
              <ClientTranslation translationKey="helpMakeBirthdaySpecial" />
            </p>
          </div>

          {wishlistItems.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-6 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <Gift className="h-8 w-8 text-muted-foreground" />
                  <div className="space-y-1">
                    <h3 className="font-medium">
                      <ClientTranslation translationKey="noItemsYet" />
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      <ClientTranslation translationKey="checkBackLater" />
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {wishlistItems.map((item) => (
                <Card
                  key={item.id}
                  className={`overflow-hidden transition-all ${item.reserved ? "bg-muted/30 border-muted" : ""}`}
                >
                  <CardHeader className="p-4 pb-0">
                    <div className="flex justify-between items-start">
                      <CardTitle>{item.name}</CardTitle>
                      {item.reserved && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                <Check className="h-3 w-3 mr-1" />
                                <ClientTranslation translationKey="reserved" />
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                <ClientTranslation translationKey="reservedBy" />: {item.reservedBy}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <CardDescription className="line-clamp-2 mb-2">{item.description}</CardDescription>
                    {item.reserved && (
                      <p className="text-xs text-muted-foreground mb-2">
                        <ClientTranslation translationKey="reservedBy" />: {item.reservedBy}
                        {item.reservationId === reservationId && (
                          <span className="ml-1 font-medium text-primary">
                            (<ClientTranslation translationKey="reservedByYou" />)
                          </span>
                        )}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button variant="secondary" className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        <ClientTranslation translationKey="viewItem" />
                      </Button>
                    </a>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={item.reserved && item.reservationId === reservationId ? "destructive" : "outline"}
                            size="icon"
                            onClick={() => handleReserveItem(item)}
                            disabled={item.reserved && item.reservationId !== reservationId}
                            className={
                              item.reserved && item.reservationId !== reservationId
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }
                          >
                            {item.reserved && item.reservationId === reservationId ? (
                              <X className="h-4 w-4" />
                            ) : (
                              <ShoppingBag className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {item.reserved && item.reservationId === reservationId ? (
                            <ClientTranslation translationKey="unreserveThis" />
                          ) : item.reserved ? (
                            <ClientTranslation translationKey="reservedStatus" />
                          ) : (
                            <ClientTranslation translationKey="reserveThis" />
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <footer className="border-t py-6 px-4 md:px-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            <ClientTranslation translationKey="allRightsReserved" />
          </p>
          <Link href="/" className="text-sm underline underline-offset-4">
            <ClientTranslation translationKey="createYourOwn" />
          </Link>
        </div>
      </footer>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              <ClientTranslation translationKey="markAsReserved" />
            </DialogTitle>
            <DialogDescription>
              <ClientTranslation translationKey="enterYourName" />
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                <ClientTranslation translationKey="yourName" />
              </Label>
              <Input
                id="name"
                value={reservationName}
                onChange={(e) => setReservationName(e.target.value)}
                className="col-span-3"
                placeholder="John Doe"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={confirmReservation} disabled={!reservationName || reservationLoading}>
              {reservationLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                  <ClientTranslation translationKey="loading" />
                </>
              ) : (
                <ClientTranslation translationKey="confirmReservation" />
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

