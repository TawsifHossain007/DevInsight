import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <header className="sticky top-0 z-50">
        <div className="w-11/12 mx-auto">
          <Navbar></Navbar>
        </div>
      </header>
      <main className="py-2 w-11/12 mx-auto min-h-[calc(100vh-302px)]">
        {children}
      </main>
      <footer>
        <Footer></Footer>
      </footer>
    </>
  );
}
