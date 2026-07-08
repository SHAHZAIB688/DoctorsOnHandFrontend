import api from "../api/client";

/**
 * Resolve coordinates to city + address via backend (Photon → Nominatim → BigDataCloud).
 */
export async function reverseGeocodeLocationFields(lat, lng) {
  const la = Number(lat);
  const ln = Number(lng);
  if (!Number.isFinite(la) || !Number.isFinite(ln)) return null;

  try {
    const { data } = await api.get("/geo/reverse", { params: { lat: la, lng: ln } });
    if (!data?.city && !data?.address) return null;
    return {
      city: data.city || "",
      address: data.address || "",
    };
  } catch {
    return null;
  }
}

/** Short label for header / browser location context */
export async function reverseGeocodePlaceName(lat, lng) {
  const fields = await reverseGeocodeLocationFields(lat, lng);
  if (!fields) return null;
  const parts = [fields.city, fields.address].filter(Boolean);
  if (parts.length === 0) return null;
  if (parts.length === 1) return parts[0];
  const addressParts = fields.address.split(",").map((s) => s.trim()).filter(Boolean);
  const tail = addressParts.slice(-2).join(", ");
  return fields.city && tail && !tail.toLowerCase().startsWith(fields.city.toLowerCase())
    ? `${fields.city}, ${tail}`
    : parts.join(", ");
}

/** Apply coords + reverse-geocoded city/address to a location form patch */
export async function coordsToLocationFormFields(lat, lng) {
  const la = Number(lat);
  const ln = Number(lng);
  if (!Number.isFinite(la) || !Number.isFinite(ln)) return null;

  const fields = await reverseGeocodeLocationFields(la, ln);
  return {
    locationLat: String(la),
    locationLng: String(ln),
    locationCity: fields?.city || "",
    locationAddress: fields?.address || "",
  };
}
