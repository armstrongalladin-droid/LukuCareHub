/**
 * Luku Care Hub — Social Links Constants
 * Single source of truth for all social media URLs
 * Update here, and all links across the site will use the same URL
 */

const SOCIAL_LINKS = {
  // Facebook Page — the verified business page
  facebook: 'https://www.facebook.com/profile.php?id=100072087281374&mibextid=rS40aB7S9Ucbxw6v',
  
  // Facebook Messenger — for direct messaging
  messengerUsername: 'bernardkip',
  
  // WhatsApp Business
  whatsapp: {
    number: '254705404515',
    url: function() {
      return `https://wa.me/${this.number}?text=Hi%20Luku%20Care%20Hub!%20I%27d%20like%20to%20book%20an%20appointment`;
    }
  }
};
