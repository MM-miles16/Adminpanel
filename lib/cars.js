export const cars = [
  // ── SUVs ──────────────────────────────────────────────────────────────────
  { slug: "toyota-fortuner", name: "Toyota Fortuner", type: "suv", transmission: "automatic", seats: 7, fuel: "diesel", pricePerDay: 3500, pricePerHour: 220, pricePerMonth: 75000, popular: true, description: "Premium 7-seater SUV perfect for highway trips and family travel.", features: ["AC", "7 Seater", "Automatic", "4WD", "Bluetooth"] },
  { slug: "innova-crysta", name: "Innova Crysta", type: "suv", transmission: "manual", seats: 7, fuel: "diesel", pricePerDay: 2800, pricePerHour: 180, pricePerMonth: 60000, popular: true, description: "Reliable 7-seater SUV ideal for outstation and family trips.", features: ["AC", "7 Seater", "Bluetooth", "USB Charging"] },
  { slug: "innova-hycross", name: "Innova Hycross", type: "suv", transmission: "automatic", seats: 7, fuel: "hybrid", pricePerDay: 3200, pricePerHour: 210, pricePerMonth: 70000, popular: true, description: "Premium hybrid 7-seater with outstanding fuel efficiency.", features: ["AC", "7 Seater", "Hybrid", "Automatic", "Panoramic Roof"] },
  { slug: "tata-harrier", name: "Tata Harrier", type: "suv", transmission: "automatic", seats: 5, fuel: "diesel", pricePerDay: 2500, pricePerHour: 160, pricePerMonth: 55000, popular: true, description: "Bold 5-seater SUV with premium features and strong road presence.", features: ["AC", "Panoramic Sunroof", "ADAS", "Bluetooth"] },
  { slug: "tata-safari", name: "Tata Safari", type: "suv", transmission: "automatic", seats: 7, fuel: "diesel", pricePerDay: 2900, pricePerHour: 190, pricePerMonth: 62000, popular: false, description: "Premium 7-seater SUV with commanding presence.", features: ["AC", "7 Seater", "Panoramic Sunroof", "ADAS"] },
  { slug: "tata-nexon", name: "Tata Nexon", type: "suv", transmission: "automatic", seats: 5, fuel: "petrol", pricePerDay: 1800, pricePerHour: 120, pricePerMonth: 40000, popular: true, description: "Compact SUV with 5-star safety rating.", features: ["AC", "Sunroof", "5-Star Safety", "Bluetooth"] },
  { slug: "tata-nexon-ev", name: "Tata Nexon EV", type: "suv", transmission: "automatic", seats: 5, fuel: "electric", pricePerDay: 2200, pricePerHour: 145, pricePerMonth: 48000, popular: false, description: "India's best-selling electric SUV.", features: ["AC", "Electric", "Sunroof", "Fast Charging"] },
  { slug: "tata-punch", name: "Tata Punch", type: "suv", transmission: "automatic", seats: 5, fuel: "petrol", pricePerDay: 1500, pricePerHour: 100, pricePerMonth: 33000, popular: false, description: "Micro SUV with 5-star safety.", features: ["AC", "5-Star Safety", "Bluetooth"] },
  { slug: "mahindra-thar", name: "Mahindra Thar", type: "suv", transmission: "manual", seats: 4, fuel: "diesel", pricePerDay: 2800, pricePerHour: 180, pricePerMonth: 58000, popular: true, description: "Iconic off-road SUV for adventurous trips.", features: ["4WD", "AC", "Convertible Top"] },
  { slug: "mahindra-thar-roxx", name: "Mahindra Thar Roxx", type: "suv", transmission: "automatic", seats: 5, fuel: "diesel", pricePerDay: 3000, pricePerHour: 200, pricePerMonth: 65000, popular: false, description: "5-door Thar with automatic gearbox.", features: ["4WD", "AC", "5 Door", "Automatic"] },
  { slug: "mahindra-xuv700", name: "Mahindra XUV700", type: "suv", transmission: "automatic", seats: 7, fuel: "diesel", pricePerDay: 3000, pricePerHour: 200, pricePerMonth: 65000, popular: true, description: "Feature-packed 7-seater SUV with advanced safety tech.", features: ["ADAS", "Panoramic Sunroof", "7 Seater"] },
  { slug: "mahindra-xuv400", name: "Mahindra XUV400", type: "suv", transmission: "automatic", seats: 5, fuel: "electric", pricePerDay: 2000, pricePerHour: 135, pricePerMonth: 44000, popular: false, description: "Electric SUV with impressive range.", features: ["Electric", "AC", "Sunroof"] },
  { slug: "mahindra-scorpio-n", name: "Mahindra Scorpio N", type: "suv", transmission: "automatic", seats: 7, fuel: "diesel", pricePerDay: 2800, pricePerHour: 185, pricePerMonth: 60000, popular: false, description: "Rugged 7-seater SUV with premium interior.", features: ["7 Seater", "4WD", "Sunroof"] },
  { slug: "mahindra-scorpio", name: "Mahindra Scorpio Classic", type: "suv", transmission: "manual", seats: 7, fuel: "diesel", pricePerDay: 2200, pricePerHour: 145, pricePerMonth: 48000, popular: false, description: "The original tough SUV for rough terrains.", features: ["7 Seater", "4WD", "AC"] },
  { slug: "hyundai-creta", name: "Hyundai Creta", type: "suv", transmission: "automatic", seats: 5, fuel: "petrol", pricePerDay: 2000, pricePerHour: 130, pricePerMonth: 44000, popular: true, description: "India's most popular compact SUV.", features: ["AC", "Sunroof", "Wireless Charger"] },
  { slug: "hyundai-creta-ev", name: "Hyundai Creta Electric", type: "suv", transmission: "automatic", seats: 5, fuel: "electric", pricePerDay: 2500, pricePerHour: 165, pricePerMonth: 55000, popular: false, description: "Electric version of India's favourite SUV.", features: ["Electric", "Panoramic Sunroof", "ADAS"] },
  { slug: "hyundai-venue", name: "Hyundai Venue", type: "suv", transmission: "automatic", seats: 5, fuel: "petrol", pricePerDay: 1600, pricePerHour: 110, pricePerMonth: 36000, popular: false, description: "Smart compact SUV with connected car technology.", features: ["AC", "Sunroof", "Connected Car"] },
  { slug: "kia-seltos", name: "Kia Seltos", type: "suv", transmission: "automatic", seats: 5, fuel: "petrol", pricePerDay: 2100, pricePerHour: 140, pricePerMonth: 46000, popular: true, description: "Feature-rich compact SUV with premium Bose sound.", features: ["AC", "Panoramic Sunroof", "Bose Audio"] },
  { slug: "kia-sonet", name: "Kia Sonet", type: "suv", transmission: "automatic", seats: 5, fuel: "petrol", pricePerDay: 1700, pricePerHour: 115, pricePerMonth: 38000, popular: false, description: "Compact SUV packed with features.", features: ["AC", "Sunroof", "Bose Audio"] },
  { slug: "kia-carens", name: "Kia Carens", type: "suv", transmission: "automatic", seats: 7, fuel: "diesel", pricePerDay: 2400, pricePerHour: 160, pricePerMonth: 52000, popular: false, description: "7-seater MPV with spacious cabin.", features: ["7 Seater", "AC", "Sunroof"] },
  { slug: "maruti-fronx", name: "Maruti Fronx", type: "suv", transmission: "automatic", seats: 5, fuel: "petrol", pricePerDay: 1600, pricePerHour: 110, pricePerMonth: 36000, popular: true, description: "Stylish compact SUV with excellent fuel efficiency.", features: ["AC", "Sunroof", "Cruise Control"] },
  { slug: "maruti-brezza", name: "Maruti Brezza", type: "suv", transmission: "automatic", seats: 5, fuel: "petrol", pricePerDay: 1700, pricePerHour: 115, pricePerMonth: 38000, popular: true, description: "Compact SUV perfect for city and road trips.", features: ["AC", "Sunroof", "HUD Display"] },
  { slug: "mg-hector", name: "MG Hector", type: "suv", transmission: "automatic", seats: 5, fuel: "petrol", pricePerDay: 2600, pricePerHour: 170, pricePerMonth: 56000, popular: false, description: "India's first internet car with 14-inch screen.", features: ["14-inch Touchscreen", "Panoramic Sunroof", "ADAS"] },
  { slug: "mg-astor", name: "MG Astor", type: "suv", transmission: "automatic", seats: 5, fuel: "petrol", pricePerDay: 2200, pricePerHour: 145, pricePerMonth: 48000, popular: false, description: "SUV with personal AI assistant.", features: ["AI Assistant", "ADAS", "Panoramic Sunroof"] },
  { slug: "volkswagen-taigun", name: "Volkswagen Taigun", type: "suv", transmission: "automatic", seats: 5, fuel: "petrol", pricePerDay: 2000, pricePerHour: 135, pricePerMonth: 44000, popular: false, description: "German-engineered compact SUV.", features: ["AC", "Sunroof", "6 Airbags"] },
  { slug: "skoda-kushaq", name: "Skoda Kushaq", type: "suv", transmission: "automatic", seats: 5, fuel: "petrol", pricePerDay: 2000, pricePerHour: 135, pricePerMonth: 44000, popular: false, description: "European compact SUV with robust build.", features: ["AC", "Sunroof", "6 Airbags"] },
  // ── Sedans ────────────────────────────────────────────────────────────────
  { slug: "honda-city", name: "Honda City", type: "sedan", transmission: "automatic", seats: 5, fuel: "petrol", pricePerDay: 1800, pricePerHour: 120, pricePerMonth: 40000, popular: false, description: "Premium sedan for comfortable city commutes.", features: ["AC", "Bluetooth", "Rear Camera"] },
  { slug: "hyundai-verna", name: "Hyundai Verna", type: "sedan", transmission: "automatic", seats: 5, fuel: "petrol", pricePerDay: 1900, pricePerHour: 125, pricePerMonth: 42000, popular: false, description: "Premium sedan with panoramic sunroof.", features: ["AC", "Panoramic Sunroof", "ADAS"] },
  { slug: "volkswagen-virtus", name: "Volkswagen Virtus", type: "sedan", transmission: "automatic", seats: 5, fuel: "petrol", pricePerDay: 1900, pricePerHour: 125, pricePerMonth: 42000, popular: false, description: "German-engineered sedan with premium interiors.", features: ["AC", "Sunroof", "6 Airbags"] },
  { slug: "skoda-slavia", name: "Skoda Slavia", type: "sedan", transmission: "automatic", seats: 5, fuel: "petrol", pricePerDay: 1900, pricePerHour: 125, pricePerMonth: 42000, popular: false, description: "European craftsmanship sedan.", features: ["AC", "Sunroof", "6 Airbags"] },
  { slug: "honda-amaze", name: "Honda Amaze", type: "sedan", transmission: "automatic", seats: 5, fuel: "petrol", pricePerDay: 1400, pricePerHour: 100, pricePerMonth: 32000, popular: false, description: "Fuel-efficient sedan for daily commutes.", features: ["AC", "Bluetooth", "Cruise Control"] },
  { slug: "maruti-dzire", name: "Maruti Dzire", type: "sedan", transmission: "automatic", seats: 5, fuel: "petrol", pricePerDay: 1300, pricePerHour: 95, pricePerMonth: 30000, popular: false, description: "India's best-selling sedan.", features: ["AC", "Bluetooth", "Rear Camera"] },
  // ── Hatchbacks ────────────────────────────────────────────────────────────
  { slug: "maruti-swift", name: "Maruti Swift", type: "hatchback", transmission: "automatic", seats: 5, fuel: "petrol", pricePerDay: 1200, pricePerHour: 90, pricePerMonth: 27000, popular: false, description: "India's most popular hatchback.", features: ["AC", "Bluetooth", "Rear Camera"] },
  { slug: "maruti-baleno", name: "Maruti Baleno", type: "hatchback", transmission: "automatic", seats: 5, fuel: "petrol", pricePerDay: 1300, pricePerHour: 95, pricePerMonth: 29000, popular: false, description: "Premium hatchback with spacious cabin.", features: ["AC", "Sunroof", "Wireless Carplay"] },
  { slug: "hyundai-i20", name: "Hyundai i20", type: "hatchback", transmission: "automatic", seats: 5, fuel: "petrol", pricePerDay: 1300, pricePerHour: 95, pricePerMonth: 30000, popular: false, description: "Premium hatchback for urban driving.", features: ["AC", "Sunroof", "Bose Audio"] },
  { slug: "toyota-glanza", name: "Toyota Glanza", type: "hatchback", transmission: "automatic", seats: 5, fuel: "petrol", pricePerDay: 1200, pricePerHour: 90, pricePerMonth: 28000, popular: false, description: "Reliable hatchback for daily commutes.", features: ["AC", "Bluetooth", "Sunroof"] },
  { slug: "tata-altroz", name: "Tata Altroz", type: "hatchback", transmission: "automatic", seats: 5, fuel: "petrol", pricePerDay: 1300, pricePerHour: 95, pricePerMonth: 29000, popular: false, description: "5-star rated premium hatchback.", features: ["AC", "5-Star Safety", "Sunroof"] },
  { slug: "volkswagen-polo", name: "Volkswagen Polo", type: "hatchback", transmission: "automatic", seats: 5, fuel: "petrol", pricePerDay: 1400, pricePerHour: 100, pricePerMonth: 32000, popular: false, description: "German hatchback with fun driving dynamics.", features: ["AC", "Bluetooth", "6 Airbags"] },
  // ── Luxury ────────────────────────────────────────────────────────────────
  { slug: "bmw-3-series", name: "BMW 3 Series", type: "luxury", transmission: "automatic", seats: 5, fuel: "petrol", pricePerDay: 7000, pricePerHour: 450, pricePerMonth: 140000, popular: false, description: "The ultimate luxury sedan.", features: ["AC", "Leather Seats", "Harman Kardon", "ADAS"] },
  { slug: "mercedes-c-class", name: "Mercedes C-Class", type: "luxury", transmission: "automatic", seats: 5, fuel: "petrol", pricePerDay: 8000, pricePerHour: 500, pricePerMonth: 160000, popular: false, description: "Iconic luxury sedan.", features: ["AC", "Leather Seats", "Burmester Audio", "ADAS"] },
  { slug: "toyota-camry", name: "Toyota Camry Hybrid", type: "luxury", transmission: "automatic", seats: 5, fuel: "hybrid", pricePerDay: 5500, pricePerHour: 350, pricePerMonth: 110000, popular: false, description: "Premium hybrid sedan.", features: ["AC", "Leather Seats", "JBL Audio", "Hybrid"] },
];

export const carTypes = [
  { slug: "suv", name: "SUV", label: "SUV Rental" },
  { slug: "sedan", name: "Sedan", label: "Sedan Rental" },
  { slug: "hatchback", name: "Hatchback", label: "Hatchback Rental" },
  { slug: "luxury", name: "Luxury", label: "Luxury Car Rental" },
  { slug: "automatic", name: "Automatic", label: "Automatic Car Rental" },
  { slug: "cheap", name: "Budget", label: "Budget Car Rental" },
  { slug: "electric", name: "Electric", label: "Electric Car Rental" },
  { slug: "7-seater", name: "7 Seater", label: "7 Seater Car Rental" },
];

export function getCarBySlug(slug) {
  return cars.find((c) => c.slug === slug) || null;
}

export function getCarsByType(type) {
  if (type === "automatic") return cars.filter((c) => c.transmission === "automatic");
  if (type === "cheap") return cars.filter((c) => c.pricePerDay <= 1800);
  if (type === "electric") return cars.filter((c) => c.fuel === "electric");
  if (type === "7-seater") return cars.filter((c) => c.seats >= 7);
  return cars.filter((c) => c.type === type);
}
