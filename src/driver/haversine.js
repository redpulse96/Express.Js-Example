const asin = Math.asin
const cos = Math.cos
const sin = Math.sin
const sqrt = Math.sqrt
const PI = Math.PI

// Mean radius of Earth (in meters)
const R = 6378137

function squared(x) {
  return x * x
}

function toRad(x) {
  return x * PI / 180.0
}

function hav(x) {
  return squared(sin(x / 2))
}

// hav(theta) = hav(bLat - aLat) + cos(aLat) * cos(bLat) * hav(bLon - aLon)
module.exports = function haversineDistance(a, b) {
  const aLat = toRad(a.latitude);
  const bLat = toRad(b.latitude);
  const aLng = toRad(a.longitude);
  const bLng = toRad(b.longitude);

  const ht = hav(bLat - aLat) + cos(aLat) * cos(bLat) * hav(bLng - aLng);
  return 2 * R * asin(sqrt(ht))
}