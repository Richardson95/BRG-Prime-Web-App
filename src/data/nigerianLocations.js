export const lagosLocations = [
  'Lekki', 'Victoria Island', 'Ikoyi', 'Ajah', 'Surulere',
  'Ikeja', 'Yaba', 'Gbagada', 'Magodo', 'Maryland',
  'Ogba', 'Festac', 'Apapa', 'Ogudu', 'Ketu',
  'Ojodu', 'Sangotedo', 'Ibeju-Lekki', 'Epe', 'Badagry',
]

export const majorCities = [
  'Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano',
  'Kaduna', 'Benin City', 'Enugu', 'Calabar', 'Uyo', 'Warri', 'Owerri',
]

// Static listing counts per location — deterministic for SSR & consistency
const locationCounts = [142, 98, 87, 76, 64, 91, 73, 54, 48, 62, 41, 38, 29, 33, 27, 31, 55, 89, 22, 18]

export const popularLocations = lagosLocations.slice(0, 8).map((name, i) => ({
  name,
  image: `https://picsum.photos/seed/loc${i + 1}/300/200`,
  count: locationCounts[i],
}))
