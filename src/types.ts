export interface Branch {
  id: string;
  nameEn: string;
  nameAr: string;
  addressEn: string;
  addressAr: string;
  phone: string;
  mapUrl: string; // Dynamic Google Maps search or embed url
}

export interface ButtonConfig {
  labelEn: string;
  labelAr: string;
  visible: boolean;
  imageUrl?: string;
}

export interface BrandItem {
  id: string;
  name: string;
  logoUrl: string;
}

export interface CompanyConfig {
  companyNameEn: string;
  companyNameAr: string;
  taglineEn: string;
  taglineAr: string;
  logoUrl: string; // Option for custom logo image
  aboutTextEn: string;
  aboutTextAr: string;
  aboutMediaUrl: string; // Warehouse/store photo/video URL
  
  // Custom button toggles
  buttons: {
    contacts: ButtonConfig;
    branches: ButtonConfig;
    social: ButtonConfig;
    midea?: ButtonConfig;
  };
  
  // Branch Repeater Data
  branches: Branch[];
  
  // Custom Contacts Info
  contactPhone: string;
  contactEmail: string;
  contactWhatsapp: string;
  workingHoursEn: string;
  workingHoursAr: string;
  contactLocationNameEn?: string;
  contactLocationNameAr?: string;
  contactLocationAddressEn?: string;
  contactLocationAddressAr?: string;
  contactMapUrl?: string;
  
  // Facebook, Instagram, TikTok links (hide if empty)
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  linkedinUrl: string;

  // Commercial brands
  brands: BrandItem[];

  // Samsung Dedicated Portal Information
  samsungPhone?: string;
  samsungWhatsapp?: string;
  samsungMapUrl?: string;
  samsungLocationNameEn?: string;
  samsungLocationNameAr?: string;
  samsungLocationAddressEn?: string;
  samsungLocationAddressAr?: string;
  samsungFacebookUrl?: string;
  samsungInstagramUrl?: string;
  samsungBranches?: Branch[];

  // Beko Dedicated Portal Information
  bekoPhone?: string;
  bekoWhatsapp?: string;
  bekoMapUrl?: string;
  bekoLocationNameEn?: string;
  bekoLocationNameAr?: string;
  bekoLocationAddressEn?: string;
  bekoLocationAddressAr?: string;
  bekoFacebookUrl?: string;
  bekoInstagramUrl?: string;
  bekoBranches?: Branch[];

  // Midea Dedicated Portal Information
  mideaPhone?: string;
  mideaWhatsapp?: string;
  mideaMapUrl?: string;
  mideaLocationNameEn?: string;
  mideaLocationNameAr?: string;
  mideaLocationAddressEn?: string;
  mideaLocationAddressAr?: string;
  mideaFacebookUrl?: string;
  mideaInstagramUrl?: string;
  mideaBranches?: Branch[];

  // Special Offers/Discounts Board
  offers?: SpecialOffer[];

  // Client Testimonials
  testimonials?: Testimonial[];
}

export interface SpecialOffer {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  badgeAr?: string;
  badgeEn?: string;
  imageUrl?: string;
  phone?: string;
  whatsapp?: string;
}

export interface Testimonial {
  id: string;
  authorNameEn: string;
  authorNameAr: string;
  authorTitleEn: string;
  authorTitleAr: string;
  feedbackEn: string;
  feedbackAr: string;
  rating: number; // 1 to 5
  imageUrl?: string;
}

export function getCleanWhatsappNumber(phone: string): string {
  if (!phone) return "";
  
  // Strip all non-digit characters (including invisible BiDi markers, spaces, dashes, parentheses, or plus signs)
  let clean = phone.replace(/\D/g, "");
  
  // Remove leading 00 if exists
  if (clean.startsWith("00")) {
    clean = clean.substring(2);
  }
  
  // Egyptian mobile numbers starting with 01 (11 digits total)
  if (clean.length === 11 && clean.startsWith("01")) {
    clean = "2" + clean;
  }
  // Egyptian mobile numbers starting with 1 but missing the leading 0 (10 digits total)
  else if (clean.length === 10 && (clean.startsWith("1") || clean.startsWith("0") === false)) {
    // If it starts with 10, 11, 12, 15, prepend 20
    if (clean.startsWith("10") || clean.startsWith("11") || clean.startsWith("12") || clean.startsWith("15")) {
      clean = "20" + clean;
    }
  }
  
  return clean;
}

export function extractMapUrl(input: string): string {
  if (!input) return "";
  const trimmed = input.trim();
  
  // If the user pasted a full iframe HTML tag, extract the src attribute
  if (trimmed.startsWith("<iframe") || trimmed.includes("<iframe")) {
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1].trim();
    }
  }
  
  return trimmed;
}

export function getDirectNavigationMapUrl(url: string, fallbackQuery: string = ""): string {
  if (!url) {
    if (fallbackQuery) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallbackQuery)}`;
    }
    return "";
  }
  
  const extracted = extractMapUrl(url);
  
  // If it is an Google Maps embed URL, rewrite it to open as a standard search/view map URL
  // so the external link opens correctly inside normal browser tabs instead of throwing an embed error.
  if (extracted.includes("/embed") || extracted.includes("output=embed") || extracted.includes("embed?pb=")) {
    if (fallbackQuery) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallbackQuery)}`;
    }
    // Try to strip &output=embed &iwloc= etc to revert back to normal query link
    let clean = extracted;
    clean = clean.replace(/([?&])output=embed/gi, "");
    clean = clean.replace(/([?&])iwloc=[^&]*/gi, "");
    return clean;
  }
  
  return extracted;
}

export function getEmbedMapUrl(url: string, fallbackQuery: string = ""): string {
  if (!url) {
    if (fallbackQuery) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(fallbackQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
    return "";
  }
  
  const trimmed = extractMapUrl(url);
  
  // If it's already an embed URL, keep it
  if (trimmed.includes("output=embed") || trimmed.includes("/embed") || trimmed.includes("embed?pb=")) {
    return trimmed;
  }
  
  // Shortened Google Maps links cannot be embedded directly in an iframe.
  // We use fallbackQuery for the embedded iframe, and keep the original URL for direct external linking.
  if (trimmed.includes("maps.app.goo.gl") || trimmed.includes("goo.gl/maps")) {
    if (fallbackQuery) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(fallbackQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
  }

  // Extract lat/long coordinates if present (e.g. @29.9649,32.5414)
  const coordMatch = trimmed.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (coordMatch) {
    const lat = coordMatch[1];
    const lng = coordMatch[2];
    return `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }

  // Try to parse URL query params
  try {
    const urlObj = new URL(trimmed);
    const q = urlObj.searchParams.get("q");
    if (q) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
  } catch (e) {
    // Ignore invalid URL logs
  }

  // Try to extract place name from path /place/Some+Place+Name/
  const placeMatch = trimmed.match(/\/place\/([^/]+)/);
  if (placeMatch) {
    const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
    return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }

  // Try to extract search term from path /search/Some+Search+Query/
  const searchMatch = trimmed.match(/\/search\/([^/?]+)/);
  if (searchMatch) {
    const searchQuery = decodeURIComponent(searchMatch[1].replace(/\+/g, " "));
    return `https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }

  // General fallback for raw address or text
  if (trimmed.startsWith("http") && trimmed.includes("google.com/maps")) {
    if (fallbackQuery) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(fallbackQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
  }

  // If we couldn't parse anything and it doesn't look like a URL, treat the input itself as a raw address query!
  if (trimmed && !trimmed.startsWith("http")) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }

  if (fallbackQuery) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(fallbackQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  }

  return trimmed;
}

