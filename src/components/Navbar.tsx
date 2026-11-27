"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-box-open text-white text-lg"></i>
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900">VB TRAVEL GLOBAL</span>
              <span className="text-xs block text-slate-500 -mt-1">Casillero China → Venezuela</span>
            </div>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#servicios" className="text-sm font-medium text-slate-700 hover:text-orange-500 transition">Servicios</Link>
            <Link href="#como-funciona" className="text-sm font-medium text-slate-700 hover:text-orange-500 transition">Cómo Funciona</Link>
            <Link href="#precios" className="text-sm font-medium text-slate-700 hover:text-orange-500 transition">Tarifas</Link>
            <Link href="#faq" className="text-sm font-medium text-slate-700 hover:text-orange-500 transition">Preguntas</Link>
            <Link href="/agentes" className="text-sm font-medium text-slate-700 hover:text-orange-500 transition">Agentes IA</Link>
            <a
              href="https://wa.me/58416111157?text=Hola%2C%20quiero%20abrir%20mi%20casillero%20en%20China%20con%20VB%20TRAVEL%20GLOBAL"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition shadow-lg hover:shadow-xl"
            >
              <i className="fab fa-whatsapp mr-2"></i>WhatsApp: +58 416 111157
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          >
            <i className={`fas ${isOpen ? "fa-times" : "fa-bars"} text-xl text-slate-700`}></i>
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-3">
              <Link href="#servicios" onClick={() => setIsOpen(false)} className="px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg">Servicios</Link>
              <Link href="#como-funciona" onClick={() => setIsOpen(false)} className="px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg">Cómo Funciona</Link>
              <Link href="#precios" onClick={() => setIsOpen(false)} className="px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg">Tarifas</Link>
              <Link href="#faq" onClick={() => setIsOpen(false)} className="px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg">Preguntas Frecuentes</Link>
              <Link href="/agentes" onClick={() => setIsOpen(false)} className="px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg">Agentes IA</Link>
              <a
                href="https://wa.me/58416111157?text=Hola%2C%20quiero%20abrir%20mi%20casillero%20en%20China%20con%20VB%20TRAVEL%20GLOBAL"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2 rounded-full text-sm font-semibold text-center"
              >
                <i className="fab fa-whatsapp mr-2"></i>WhatsApp: +58 416 111157
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
