import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Gift, ChevronRight, Sparkles } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"
import ClientTranslation from "@/components/client-translation"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Gift className="h-6 w-6 text-primary" />
          <span className="text-primary">WishMaker</span>
        </Link>
        <nav className="flex gap-4 sm:gap-6 items-center">
          <LanguageSelector />
          <Link href="/login">
            <ClientTranslation translationKey="login" className="text-sm font-medium text-foreground" />
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter text-primary sm:text-5xl xl:text-6xl">
                    <ClientTranslation translationKey="heroTitle" />
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    <ClientTranslation translationKey="heroSubtitle" />
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/login">
                    <Button size="lg" className="gap-1.5">
                      <ClientTranslation translationKey="getStarted" />
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute -top-6 -left-6 h-48 w-48 rounded-full bg-primary/20 blur-3xl"></div>
                  <div className="absolute -bottom-6 -right-6 h-48 w-48 rounded-full bg-primary/20 blur-3xl"></div>
                  <div className="relative rounded-xl border bg-background p-6 shadow-lg">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">
                          <ClientTranslation translationKey="birthdayWishlist" />
                        </h3>
                      </div>
                      <div className="space-y-3">
                        <div className="rounded-lg border p-3">
                          <div className="font-medium">Nintendo Switch OLED</div>
                          <div className="text-sm text-muted-foreground">
                            The latest gaming console with enhanced display
                          </div>
                          <div className="mt-2 text-xs text-blue-500">amazon.com/nintendo-switch</div>
                        </div>
                        <div className="rounded-lg border p-3">
                          <div className="font-medium">Wireless Headphones</div>
                          <div className="text-sm text-muted-foreground">Noise-cancelling with great battery life</div>
                          <div className="mt-2 text-xs text-blue-500">bestbuy.com/headphones</div>
                        </div>
                        <div className="rounded-lg border p-3">
                          <div className="font-medium">Cooking Class</div>
                          <div className="text-sm text-muted-foreground">Italian cuisine masterclass</div>
                          <div className="mt-2 text-xs text-blue-500">cookingschool.com/classes</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  <ClientTranslation translationKey="howItWorks" />
                </div>
                <h2 className="text-3xl font-bold tracking-tighter text-primary md:text-4xl">
                  <ClientTranslation translationKey="createShareCelebrate" />
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  <ClientTranslation translationKey="platformDescription" />
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4 rounded-xl border p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-foreground">
                    <ClientTranslation translationKey="createWishlist" />
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    <ClientTranslation translationKey="createWishlistDesc" />
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4 rounded-xl border p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
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
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-foreground">
                    <ClientTranslation translationKey="shareWithFriends" />
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    <ClientTranslation translationKey="shareWithFriendsDesc" />
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4 rounded-xl border p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
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
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-foreground">
                    <ClientTranslation translationKey="receivePerfectGifts" />
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    <ClientTranslation translationKey="receivePerfectGiftsDesc" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-muted-foreground">
          <ClientTranslation translationKey="allRightsReserved" />
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            <ClientTranslation translationKey="termsOfService" />
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            <ClientTranslation translationKey="privacy" />
          </Link>
        </nav>
      </footer>
    </div>
  )
}

