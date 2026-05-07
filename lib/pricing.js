/**
 * Pricing Calculation Engine
 * All tier-based pricing logic is centralized here for easy editing
 */

// Fixed constants
const GST_RATE = 0.18;
const BASE_CONVENIENCE_FEE = 250;

// Tier configuration - EDIT THIS TO ADJUST PRICING
// Note: maxHours is the last hour INCLUDED in the tier (inclusive upper bound)
const PRICING_TIERS = {
  TIER_1: {
    name: '6-12 Hours',
    minHours: 6,
    maxHours: 11,           // Up to 11 hours (12 goes to next tier)
    priceAdjustment: 1.00, // +100% surge
    insuranceDivisor: 9.4,
    convenienceAddOn: 0,
  },
  TIER_2: {
    name: '12-24 Hours',
    minHours: 12,
    maxHours: 23,           // Up to 23 hours (24 goes to next tier)
    priceAdjustment: 0.67, // +67% surge
    insuranceDivisor: 9.4,
    convenienceAddOn: 50,
  },
  TIER_3: {
    name: '1-2 Days',
    minHours: 24,
    maxHours: 71,           // Up to 71 hours (covers 24-71, next starts at 72)
    priceAdjustment: 0.00, // 0% (base price)
    insuranceDivisor: 7.7,
    convenienceAddOn: 100,
  },
  TIER_4: {
    name: '3-6 Days',
    minHours: 72,
    maxHours: 167,          // Up to 167 hours (covers 72-167, next starts at 168)
    priceAdjustment: -0.05, // -5% discount
    insuranceDivisor: 3.8,
    convenienceAddOn: 200,
  },
  TIER_5: { 
    name: '7-13 Days',
    minHours: 168,
    maxHours: 335,          // Up to 335 hours (covers 168-335, next starts at 336)
    priceAdjustment: -0.15, // -15% discount
    insuranceDivisor: 2.84,
    convenienceAddOn: 400,
  },
  TIER_6: {
    name: '14-29 Days',
    minHours: 336,
    maxHours: 696,
    priceAdjustment: -0.20, // -20% discount
    insuranceDivisor: 2.25,
    convenienceAddOn: 800,
  },
};

/**
 * Determine which tier a booking falls into based on duration
 * @param {number} hours - Duration in hours
 * @returns {object} - The matching tier configuration
 */
function getTierForDuration(hours) {
  // Check tiers in order from highest to lowest
  if (hours >= PRICING_TIERS.TIER_6.minHours) {
    return PRICING_TIERS.TIER_6;
  }
  if (hours >= PRICING_TIERS.TIER_5.minHours) {
    return PRICING_TIERS.TIER_5;
  }
  if (hours >= PRICING_TIERS.TIER_4.minHours) {
    return PRICING_TIERS.TIER_4;
  }
  if (hours >= PRICING_TIERS.TIER_3.minHours) {
    return PRICING_TIERS.TIER_3;
  }
  if (hours >= PRICING_TIERS.TIER_2.minHours) {
    return PRICING_TIERS.TIER_2;
  }
  // Default to TIER_1 for less than 12 hours
  return PRICING_TIERS.TIER_1;
}

/**
 * Calculate complete pricing for a booking
 * @param {object} params - Booking parameters
 * @param {number} params.baseDailyRate - Daily base rate from DB (B_day)
 * @param {Date} params.pickupTime - Pickup date/time
 * @param {Date} params.returnTime - Return date/time
 * @param {number} params.discount - Coupon discount (default: 0)
 * @returns {object} - Complete pricing breakdown
 */
function calculatePricing({
  baseDailyRate,
  pickupTime,
  returnTime,
  discount = 0
}) {
  // Calculate duration
  const diffMs = returnTime - pickupTime;
  const hours = Math.ceil(diffMs / 3600000);

  if (hours <= 0) {
    throw new Error('Return time must be after pickup time');
  }

  // Get the applicable tier
  const tier = getTierForDuration(hours);

  // Calculate base rates
  const baseHourlyRate = Math.round(baseDailyRate / 24);

  // Calculate rental cost with tier adjustment
  // priceAdjustment is positive for surge, negative for discount
  const rentalMultiplier = 1 + tier.priceAdjustment;
  const hourlyRate = Math.round(baseHourlyRate * rentalMultiplier);
  const rentalCost = Math.round(hours * hourlyRate);

  // Calculate insurance cost (fixed per tier based on divisor) - Increased by 10% globally
  const insuranceCost = Math.round((baseDailyRate / tier.insuranceDivisor) * 1.10);

  // Calculate convenience fee
  const convFee = BASE_CONVENIENCE_FEE + tier.convenienceAddOn;

  // Calculate subtotal before GST
  const subtotalBeforeGST = rentalCost + insuranceCost + convFee;

  // Calculate GST (18% on rental cost only - excluding insurance and convenience fee)
  const gst = Math.round(rentalCost * GST_RATE);

  // Calculate total before discount
  const totalBeforeDiscount = subtotalBeforeGST + gst;

  // Apply discount
  const discountAmount = Math.round(Math.max(0, Math.min(discount, totalBeforeDiscount)));
  const total = totalBeforeDiscount - discountAmount;

  return {
    hours,
    tier: {
      name: tier.name,
      priceAdjustment: tier.priceAdjustment,
      priceAdjustmentPercent: (tier.priceAdjustment * 100).toFixed(0),
    },
    rates: {
      baseDailyRate,
      baseHourlyRate: Math.round(baseHourlyRate),
      adjustedHourlyRate: Math.round(hourlyRate),
    },
    costs: {
      rentalCost: Math.round(rentalCost),
      insuranceCost: Math.round(insuranceCost),
      convFee: Math.round(convFee),
      gst: Math.round(gst),
      subtotalBeforeGST: Math.round(subtotalBeforeGST),
      totalBeforeDiscount: Math.round(totalBeforeDiscount),
    },
    discount: Math.round(discountAmount),
    total: Math.round(total),
  };
}

/**
 * Calculate estimated price for display (without exact dates)
 * @param {number} baseDailyRate - Daily base rate from DB
 * @param {number} hours - Estimated duration in hours
 * @returns {object} - Pricing summary for display
 */
function estimatePrice(baseDailyRate, hours) {
  const tier = getTierForDuration(hours);
  const baseHourlyRate = Math.round(baseDailyRate / 24);
  const rentalMultiplier = 1 + tier.priceAdjustment;
  const hourlyRate = Math.round(baseHourlyRate * rentalMultiplier);
  const rentalCost = Math.round(hours * hourlyRate);
  const insuranceCost = Math.round((baseDailyRate / tier.insuranceDivisor) * 1.10);
  const convFee = BASE_CONVENIENCE_FEE + tier.convenienceAddOn;
  const subtotalBeforeGST = rentalCost + insuranceCost + convFee;
  const gst = Math.round(rentalCost * GST_RATE);
  const total = subtotalBeforeGST + gst;

  return {
    hours,
    tierName: tier.name,
    hourlyRate: Math.round(hourlyRate),
    rentalCost: Math.round(rentalCost),
    insuranceCost: Math.round(insuranceCost),
    convFee: Math.round(convFee),
    gst: Math.round(gst),
    total: Math.round(total),
  };
}

/**
 * Get all pricing tiers for admin/configuration
 * @returns {array} - Array of tier configurations
 */
function getAllTiers() {
  return Object.values(PRICING_TIERS);
}

/**
 * Update tier configuration (for admin panel use)
 * @param {string} tierKey - The tier key (e.g., 'TIER_1')
 * @param {object} updates - Updates to apply
 */
function updateTierConfig(tierKey, updates) {
  if (PRICING_TIERS[tierKey]) {
    PRICING_TIERS[tierKey] = {
      ...PRICING_TIERS[tierKey],
      ...updates
    };
    return true;
  }
  return false;
}

export {
  calculatePricing,
  estimatePrice,
  getAllTiers,
  updateTierConfig,
  getTierForDuration,
  PRICING_TIERS,
  GST_RATE,
  BASE_CONVENIENCE_FEE,
};