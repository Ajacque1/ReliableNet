interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
}

export async function getCurrentLocation(): Promise<LocationData> {
  try {
    // Get coordinates from browser
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    });

    const { latitude, longitude } = position.coords;

    // Use OpenStreetMap's Nominatim for reverse geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    );

    const data = await response.json();
    const address = data.address;

    return {
      latitude,
      longitude,
      city: address.city || address.town || address.village,
      state: address.state,
      country: address.country,
      zip: address.postcode,
    };
  } catch (error) {
    console.error('Failed to get location:', error);
    throw error;
  }
} 