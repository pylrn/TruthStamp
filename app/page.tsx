
import Navbar from "./components/navbar";
import Hero from "./components/hero";

import Footer from "./components/footer";

export default function Page() {
  return (
    <>
   
      <Navbar />
      <main className="relative z-10 px-6">
        <Hero />
      
      </main>
      <Footer />
    </>
  );
}
