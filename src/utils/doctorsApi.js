/** Normalize GET /doctors response (array legacy or { doctors, ... } object). */
export function parseDoctorsResponse(data) {
  if (Array.isArray(data)) {
    return {
      doctors: data,
      total: data.length,
      matchedSpecializations: [],
      autoMatched: false,
      condition: null,
    };
  }
  const doctors = Array.isArray(data?.doctors) ? data.doctors : [];
  return {
    doctors,
    total: Number.isFinite(data?.total) ? data.total : doctors.length,
    matchedSpecializations: data?.matchedSpecializations || [],
    autoMatched: Boolean(data?.autoMatched),
    condition: data?.condition || null,
  };
}

export const haversineKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

export const formatDoctorRating = (doctor) => {
  const rating = Number(doctor?.averageRating);
  if (Number.isFinite(rating) && rating > 0) return rating.toFixed(1);
  return "—";
};
