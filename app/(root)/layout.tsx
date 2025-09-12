import { Footer, Navbar } from "@/components";
import CartPersistenceProvider from "@/components/providers/CartPersistenceProvider";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <CartPersistenceProvider>
      <div className="min-h-screen bg-slate-900 flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </CartPersistenceProvider>
  );
}
