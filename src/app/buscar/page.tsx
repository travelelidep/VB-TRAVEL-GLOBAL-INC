import { redirect } from "next/navigation";
import { assignAgent } from "@/lib/agent-assignment";

interface SearchParams {
  origen?: string;
  destino?: string;
  fechaIda?: string;
  fechaVuelta?: string;
  pasajeros?: string;
  ninos?: string;
  bebes?: string;
  clase?: string;
  tipoViaje?: string;
  agente?: string;
  campaign?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  [key: string]: string | undefined;
}

export const dynamic = "force-dynamic";

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  // Asignar agente si no viene en params
  const agenteAsignado = params.agente || assignAgent(params);

  // Construir parámetros para WINGS
  const wingsParams = new URLSearchParams({
    // Parámetros de búsqueda
    origin: params.origen || "",
    destination: params.destino || "",
    departureDate: params.fechaIda || "",
    returnDate: params.fechaVuelta || "",
    adults: params.pasajeros || "1",
    children: params.ninos || "0",
    infants: params.bebes || "0",
    cabinClass: params.clase || "Economy",

    // Tracking y atribución
    agentRef: "MDTRAVEL_WEB",
    subAgent: agenteAsignado,
    utm_source: params.utm_source || "mdtravel-web",
    utm_medium: params.utm_medium || "bridge_page",
    utm_campaign: params.campaign || params.utm_campaign || "organic",
    utm_content: agenteAsignado,
  });

  // Limpiar parámetros vacíos
  for (const [key, value] of wingsParams.entries()) {
    if (!value) wingsParams.delete(key);
  }

  const wingsUrl = "https://mdtravelgloballlc.mywingsbooking.com/es/search?" + wingsParams.toString();

  // Redirect 302 a WINGS
  redirect(wingsUrl);
}
