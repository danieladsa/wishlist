import { initializeApp, getApps } from "firebase/app"
import { getAuth, onAuthStateChanged, type User } from "firebase/auth"
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"

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

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)
const db = getFirestore(app)
let analytics: any = null

// Only initialize analytics on the client side
if (typeof window !== "undefined") {
  analytics = getAnalytics(app)

  // Enable offline persistence when possible
  try {
    enableIndexedDbPersistence(db).catch((err) => {
      if (err.code === "failed-precondition") {
        console.warn("Persistence failed: multiple tabs open")
      } else if (err.code === "unimplemented") {
        console.warn("Persistence not available in this browser")
      }
    })
  } catch (error) {
    console.warn("Error enabling persistence:", error)
  }
}

// Utility function to get current user with Promise
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe()
        resolve(user)
      },
      reject,
    )
  })
}

export { app, auth, db, analytics }

