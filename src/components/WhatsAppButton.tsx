export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/1234567890?text=Hola%2C%20quiero%20información%20sobre%20viajes"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-green-500 rounded-full shadow-2xl flex items-center justify-center hover:bg-green-600 hover:scale-110 transition-all duration-300"
      title="Escríbenos por WhatsApp"
    >
      <i className="fab fa-whatsapp text-white text-2xl"></i>
    </a>
  );
}
