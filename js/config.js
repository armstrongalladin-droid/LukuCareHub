/**
 * Luku Care Hub — Site Configuration
 * Update these values with your real business details.
 * Designed for ManyChat / WhatsApp Business API integration.
 */
const LUKU_CONFIG = {
  businessName: 'Luku Care Hub',
  tagline: 'Premium grooming in the heart of Kenya',
  location: 'Nakuru, Kenya, Rafiki',

  // Kenya format: 2547XXXXXXXX (no + or spaces)
  whatsappNumber: '254705404515',

  // Facebook Page username (for m.me links) or numeric Page ID
  facebookPage: 'bernardkip',
  facebookPageUrl: 'https://facebook.com/bernardkip',

  // Messenger Customer Chat Plugin — your Facebook Page ID (numeric)
  facebookPageId: '000000000000000',

  hours: {
    weekdays: 'Mon – Sat: 8:00 AM – 8:00 PM',
    sunday: 'Sun: 10:00 AM – 6:00 PM',
  },

  email: 'hello@lukucare.co.ke',
  phone: '+254 705 404 515',
  address: 'Rafiki, Nakuru, Kenya',
  googleMapsUrl:
    'https://www.google.com/maps/place/Luku+Care+Barbershop/@-0.1537423,35.9605672,17z/data=!4m7!3m6!1s0x1829f7321e451dc3:0x3000b825ce72218b!4b1!8m2!3d-0.1537423!4d35.9605672!16s%2Fg%2F11mydyw1kq?entry=ttu',

  // Default booking message template (automation-friendly)
  bookingMessageTemplate:
    'Hello Luku Care! I would like to book an appointment.\n\n' +
    'Service: {service}\n' +
    'Preferred date: {date}\n' +
    'Preferred time: {time}\n' +
    'Name: {name}\n' +
    'Phone: {phone}\n\n' +
    'Sent via website booking form.',

  services: [
    { id: 'classic-cut', name: 'Classic Cut', duration: '30 min', image: 'images/services/classic-cut.jpg' },
    { id: 'fade', name: 'Premium Fade', duration: '45 min', image: 'images/services/premium-fade.jpg' },
    { id: 'beard', name: 'Beard Sculpt', duration: '25 min', image: 'images/services/beard.jpg' },
    { id: 'hot-towel', name: 'Hot Towel Shave', duration: '40 min', image: 'images/services/hot-towel.jpg' },
    { id: 'kids', name: "Kids' Cut", duration: '25 min', image: 'images/services/kids.jpg' },
    { id: 'vip', name: 'VIP Experience', duration: '90 min', image: 'images/services/vip.jpg' },
  ],
};
