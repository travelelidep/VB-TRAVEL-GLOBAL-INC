import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Servicios from "@/components/Servicios";
import ComoFunciona from "@/components/ComoFunciona";
import Tarifas from "@/components/Tarifas";
import CotizadorWizard from "@/components/CotizadorWizard";
import TrackingWidget from "@/components/TrackingWidget";
import Preguntas from "@/components/Preguntas";
import ContactoCotizacion from "@/components/ContactoCotizacion";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        <Servicios />
        <ComoFunciona />
        <Tarifas />
        <CotizadorWizard />
        <TrackingWidget />
        <Preguntas />
        <ContactoCotizacion />
      </main>
      <Footer />
    </>
  );
}
