// utils/geocode.js
const axios = require('axios');

async function getLatLng(address) {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: address, format: 'json' },
      headers: { 'User-Agent': 'PotholeReporter/1.0' }
    });
    if (response.data.length > 0) {
      return {
        lat: parseFloat(response.data[0].lat),
        lng: parseFloat(response.data[0].lon)
      };
    }
  } catch (err) {
    console.error('Geocoding failed for', address, err.message);
  }
  return null;
}

module.exports = { getLatLng };
