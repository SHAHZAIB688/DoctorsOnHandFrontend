/**
 * Resolve coordinates to a short place label (client-side, no API key).
 * Uses BigDataCloud reverse-geocode-client (browser-friendly CORS).
 */
export async function reverseGeocodePlaceName(lat, lng) {
  const la = Number(lat);
  const ln = Number(lng);
  if (!Number.isFinite(la) || !Number.isFinite(ln)) return null;

  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${encodeURIComponent(la)}&longitude=${encodeURIComponent(ln)}&localityLanguage=en`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();

    const cityLike =
      [data.city, data.locality, data.village].find((x) => x && String(x).trim()) || "";
    const region = data.principalSubdivision && String(data.principalSubdivision).trim();
    const country = data.countryName && String(data.countryName).trim();

    const parts = [];
    if (cityLike) parts.push(cityLike);
    if (region && region !== cityLike) parts.push(region);
    if (country && !parts.includes(country)) parts.push(country);

    if (parts.length > 0) return parts.slice(0, 3).join(", ");

    if (data.localityInfo?.informative?.length) {
      return String(data.localityInfo.informative[0]).trim() || null;
    }
    return country || null;
  } catch {
    return null;
  }
}
