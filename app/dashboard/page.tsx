"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gift, Plus, ExternalLink, Trash2, LogOut, User } from "lucide-react"
import { initializeApp } from "firebase/app"
import { getAuth, signOut } from "firebase/auth"
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc } from "firebase/firestore"
import { getCurrentUser } from "@/lib/firebase"
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

interface WishlistItem {
  id: string
  name: string
  link: string
  description: string
  userId: string // 🔹 Necesario para que Firestore permita escribir
}

// Función para agregar un item a la wishlist
async function addWishlistItem(item: WishlistItem, userId: string) {
  await addDoc(collection(db, "wishlistItems"), { ...item, userId })
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [newItem, setNewItem] = useState({
    name: "",
    link: "",
    description: "",
  })
  const [activeTab, setActiveTab] = useState("wishlist");

  const handleAddTabClick = () => {
    setActiveTab("add");  // Cambiar a la pestaña "add"
  };
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)
        const currentUser = await getCurrentUser()

        if (currentUser) {
          setUser(currentUser)
          fetchWishlistItems(currentUser.uid)
        } else {
          router.push("/login")
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const fetchWishlistItems = async (userId: string) => {
    setLoading(true)
    try {
      const q = query(collection(db, "wishlistItems"), where("userId", "==", userId))

      const querySnapshot = await getDocs(q)

      const items: WishlistItem[] = []
      querySnapshot.forEach((doc) => {
        items.push({
          id: doc.id,
          ...doc.data(),
        } as WishlistItem)
      })

      setWishlistItems(items)
    } catch (error) {
      console.error("Error fetching wishlist items:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      console.error("Usuario no autenticado")
      alert("Debes iniciar sesión para agregar elementos a tu lista de deseos")
      return
    }

    console.log("Usuario autenticado:", user.uid) // Verificar que el ID de usuario existe

    try {
      // Mostrar estado de carga
      setLoading(true)

      // Validar la URL del enlace
      let formattedLink = newItem.link
      if (formattedLink && !formattedLink.startsWith("http")) {
        formattedLink = `https://${formattedLink}`
      }

      const itemToAdd = {
        ...newItem,
        link: formattedLink,
        userId: user.uid,
        createdAt: new Date(),
      }

      console.log("Intentando agregar item:", itemToAdd) // Verificar datos antes de enviar

      // Usar la nueva función para agregar el item
      await addWishlistItem(itemToAdd, user.uid)

      // Actualizar el estado local con el nuevo item
      const newItemWithId = {
        id: itemToAdd.id, // Si el item ya tiene un ID al ser creado
        name: itemToAdd.name,
        link: itemToAdd.link,
        description: itemToAdd.description,
      }

      setWishlistItems((prevItems) => [...prevItems, newItemWithId])
      setNewItem({ name: "", link: "", description: "" })

      // Cambiar a la pestaña de wishlist después de agregar
      document.querySelector('[data-value="wishlist"]')?.click()
       setActiveTab("wishlist"); 
    } catch (error) {
      console.error("Error adding wishlist item:", error)
      alert("Error al añadir el producto: " + (error instanceof Error ? error.message : "Permisos insuficientes"))
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteDoc(doc(db, "wishlistItems", itemId))
      setWishlistItems(wishlistItems.filter((item) => item.id !== itemId))
    } catch (error) {
      console.error("Error deleting wishlist item:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground">Cargando tu lista de deseos...</p>
      </div>
    )
  }
  console.log(user)
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Gift className="h-6 w-6 text-primary" />
          <span className="text-primary">WishMaker</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">{user?.displayName || user?.email}</span>
          </div>
          <LanguageSelector />
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">
              <ClientTranslation translationKey="logout" />
            </span>
          </Button>
        </div>
      </header>
      <main className="flex-1 container max-w-5xl py-8 px-4">
        <Tabs defaultValue="wishlist" className="w-full"  value={activeTab} onValueChange={setActiveTab} >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="wishlist">
              <ClientTranslation translationKey="myWishlist" />
            </TabsTrigger>
            <TabsTrigger value="add">
              <ClientTranslation translationKey="addNewItem" />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="wishlist">
            <div className="grid gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">
                  <ClientTranslation translationKey="myWishlist" />
                </h2>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/wishlist/${user?.uid}/${user?.displayName}`,
                    )
                    alert(t("copied"))
                  }}
                >
                  <ClientTranslation translationKey="shareWishlist" />
                </Button>
              </div>

              {wishlistItems.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="pt-6 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Gift className="h-8 w-8 text-muted-foreground" />
                      <div className="space-y-1">
                        <h3 className="font-medium">
                          <ClientTranslation translationKey="noItems" />
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          <ClientTranslation translationKey="addSomeItems" />
                        </p>
                      </div>
                      <Button variant="secondary" onClick={handleAddTabClick}>
                        <Plus className="mr-2 h-4 w-4" />
                        <ClientTranslation translationKey="addFirstItem" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {wishlistItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <CardHeader className="p-4">
                        <CardTitle >{item.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <CardDescription className="line-clamp-2 mb-2">{item.description}</CardDescription>
                        <div className="flex items-center text-sm text-blue-500 hover:underline">
                          <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            <ClientTranslation translationKey="viewItem" />
                          </a>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>
                  <ClientTranslation translationKey="addNewWishlistItem" />
                </CardTitle>
                <CardDescription>
                  <ClientTranslation translationKey="addItemDescription" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddItem} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      <ClientTranslation translationKey="itemName" />
                    </Label>
                    <Input
                      id="name"
                      placeholder="Nintendo Switch OLED"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">
                      <ClientTranslation translationKey="description" />
                    </Label>
                    <Input
                      id="description"
                      placeholder="The latest gaming console with enhanced display"
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="link">
                      <ClientTranslation translationKey="purchaseLink" />
                    </Label>
                    <Input
                      id="link"
                      placeholder="https://amazon.com/nintendo-switch"
                      value={newItem.link}
                      onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                        <ClientTranslation translationKey="adding" />
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        <ClientTranslation translationKey="addToWishlist" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="border-t py-6 px-4 md:px-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            <ClientTranslation translationKey="allRightsReserved" />
          </p>
        </div>
      </footer>
    </div>
  )
}

