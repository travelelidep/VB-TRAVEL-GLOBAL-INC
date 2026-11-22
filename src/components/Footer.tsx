"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2024);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-box-open text-white text-lg"></i>
              </div>
              <div>
                <span className="text-xl font-bold">VB TRAVEL GLOBAL INC</span>
                <span className="text-xs block text-slate-400 -mt-1">Casillero China → Venezuela</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Tu casillero en China para compras online. Almacén propio en Guangzhou.
              Consolidamos tus paquetes de Taobao, 1688, Alibaba, Tmall y te los entregamos
              puerta a puerta en toda Venezuela.
            </p>
            <div className="flex space-x-3">
              <a href="https://wa.me/58416111157" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-green-500 transition">
                <i className="fab fa-whatsapp text-sm"></i>
              </a>
              <a href="https://www.instagram.com/vbtravelglobal" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-orange-500 transition">
                <i className="fab fa-instagram text-sm"></i>
              </a>
              <a href="https://www.tiktok.com/@vbtravelglobal" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-orange-500 transition">
                <i className="fab fa-tiktok text-sm"></i>
              </a>
              <a href="https://www.facebook.com/vbtravelglobal" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-blue-500 transition">
                <i className="fab fa-facebook-f text-sm"></i>
              </a>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Servicios</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="#casillero" className="hover:text-orange-400 transition">Apertura de Casillero Gratis</Link></li>
              <li><Link href="#aereo" className="hover:text-orange-400 transition">Envío Aéreo Express 24-48h</Link></li>
              <li><Link href="#maritimo" className="hover:text-orange-400 transition">Envío Marítimo LCL/FCL 25-35d</Link></li>
              <li><Link href="#consolidacion" className="hover:text-orange-400 transition">Consolidación de Paquetes</Link></li>
              <li><Link href="#aduana" className="hover:text-orange-400 transition">Despacho Aduanal Venezuela</Link></li>
              <li><Link href="#entrega" className="hover:text-orange-400 transition">Entrega Puerta a Puerta</Link></li>
            </ul>
          </div>

          {/* Destinos */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Origen y Destino</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><span className="hover:text-orange-400 transition cursor-pointer">🇨🇳 China: Guangzhou (Almacén Principal)</span></li>
              <li><span className="hover:text-orange-400 transition cursor-pointer">🇨🇳 China: Shenzhen, Yiwu, Shanghai</span></li>
              <li><span className="hover:text-orange-400 transition cursor-pointer">🇻🇪 Venezuela: Caracas, Valencia</span></li>
              <li><span className="hover:text-orange-400 transition cursor-pointer">🇻🇪 Venezuela: Maracaibo, Barquisimeto</span></li>
              <li><span className="hover:text-orange-400 transition cursor-pointer">🇻🇪 Venezuela: Puerto Ordaz, Maturín</span></li>
              <li><span className="hover:text-orange-400 transition cursor-pointer">🇻🇪 Toda Venezuela Door-to-Door</span></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center space-x-2">
                <i className="fas fa-envelope text-orange-500"></i>
                <a href="mailto:info@vbtravelglobal.com" className="hover:text-orange-400 transition">info@vbtravelglobal.com</a>
              </li>
              <li className="flex items-center space-x-2">
                <i className="fab fa-whatsapp text-green-500"></i>
                <a href="https://wa.me/58416111157" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition">+58 416 111157</a>
              </li>
              <li className="flex items-center space-x-2">
                <i className="fas fa-map-marker-alt text-orange-500"></i>
                <span>Almacén: Guangzhou, Guangdong, China</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="fas fa-clock text-orange-500"></i>
                <span>Lun-Sáb: 8am-6pm (Hora Venezuela)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>© {currentYear} VB TRAVEL GLOBAL INC. Todos los derechos reservados.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/politica-privacidad" className="hover:text-white transition">Política de Privacidad</Link>
            <Link href="/terminos" className="hover:text-white transition">Términos y Condiciones</Link>
            <Link href="/reclamos" className="hover:text-white transition">Reclamos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
