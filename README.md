# Luku Care Hub Website

Premium multi-page website for **Luku Care Hub** in Nakuru, Kenya. Built for conversion via WhatsApp and Facebook messaging.

## Pages

| Page | File |
|------|------|
| Home | `index.html` |
| Services | `services.html` |
| About | `about.html` (includes Meet Your Barber) |
| Gallery | `gallery.html` |
| Booking | `booking.html` |
| Contact | `contact.html` |

## Quick Start

1. Open `index.html` in a browser, or run a local server:

   ```bash
   npx serve .
   ```

2. Edit **`js/config.js`** with your real details:
   - `whatsappNumber` — Kenya format: `2547XXXXXXXX`
   - `facebookPage` — Page username for m.me links
   - `facebookPageId` — Numeric Page ID for Messenger chat plugin
   - Services, hours, address, email

## Features

- **Design:** Cream `#FAF7F0`, gold `#D4AF37`, black `#1A1A1A`
- **Sticky navigation** with mobile menu
- **Floating WhatsApp button** on every page
- **Pre-filled booking messages** from form and service buttons
- **Facebook Messenger** buttons + Customer Chat plugin (when Page ID is set)
- **Booking form** → opens WhatsApp with structured message
- **Automation:** `luku:booking` custom event on form submit for ManyChat/Zapier/webhooks

## Automation Hook Example

```javascript
document.getElementById('booking-form').addEventListener('luku:booking', function (e) {
  console.log('Booking data:', e.detail);
  // Send to your webhook, ManyChat, etc.
});
```

## Deploy

Upload all files to any static host (Netlify, Vercel, GitHub Pages, cPanel). No build step required.

## Replace Placeholders

- Unsplash images → your own photos in `gallery.html` and the About barber profile
- Google Maps iframe in `contact.html`
- Phone, email, and social URLs in `config.js`
