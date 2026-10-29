"use client"

import { SignUp } from "@clerk/nextjs"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Criar conta</h1>
            <p className="text-muted-foreground mt-2">Comece a comprar, vender ou salvar favoritos</p>
          </div>
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
                card: "shadow-xl border",
              },
            }}
            routing="path"
            signInUrl="/login"
            afterSignUpUrl="/dashboard"
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}