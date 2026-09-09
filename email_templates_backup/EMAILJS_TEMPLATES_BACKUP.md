# EmailJS Templates Configuration & Backup Guide

Your EmailJS configuration is organized into two dedicated templates:

---

## 1. RSVP Confirmation Email (`template_hvorhqr`)

Used when guests submit their RSVP on the website or when admins resend an RSVP confirmation.

In your EmailJS Dashboard (https://dashboard.emailjs.com/admin/templates/template_hvorhqr):

### **Header Settings:**
- **Template Name:** Thank you for confirming! / ¡Gracias por confirmar! - Lama & Alvaro's
- **Template ID:** `template_hvorhqr`
- **Subject:** `Thank you for confirming! / ¡Gracias por confirmar! - Lama & Alvaro's`
- **To Email:** `{{to_email}}`
- **From Name:** `Lama & Álvaro`
- **Reply To:** `{{reply_to}}`

### **Content / Body:**
```html
<p>Dear {{to_name}},</p>

<p>Thank you so much for RSVPing to our wedding! We are so excited to celebrate with you.</p>

{{{room_details_html}}}

<p>If you have any questions or need to make any changes, please feel free to reach out to us.</p>

<p>Warmly,<br/>
Lama & Álvaro</p>
```

---

## 2. Castillo Room Accommodation & Payment Guide (`template_paymentlink`)

Dedicated template used by the Admin Panel modal (*"Send Castillo Room Payment Email"* / *"Send Test Email"*).

In your EmailJS Dashboard (https://dashboard.emailjs.com/admin/templates/template_paymentlink):

### **Header Settings:**
- **Template Name:** Castillo Room Accommodation & Payment Guide
- **Template ID:** `template_paymentlink`
- **Subject:** `Lama & Álvaro's Wedding — Castillo de Monda Room & Payment Guide`
- **To Email:** `{{to_email}}`
- **From Name:** `Lama & Álvaro`
- **Reply To:** `{{reply_to}}`

### **Content / Body:**
The app injects the complete styled email with images, terracotta callout boxes, and step-by-step guidance. In EmailJS, set the content body to:

```handlebars
{{{payment_html}}}
```
*(Note: `{{{room_details_html}}}` and `{{{message_html}}}` are also sent as aliases and will work identically.)*

> **IMPORTANT:** Always use **triple curly braces** `{{{payment_html}}}`. Triple braces tell EmailJS to render the HTML tags, styles, and images without escaping.

---

## 3. Code Reference

- **Service ID:** `service_am48iun`
- **RSVP Template (`EMAILJS_TEMPLATE_ID`):** `template_hvorhqr`
- **Payment Guide Template (`EMAILJS_PAYMENT_TEMPLATE_ID`):** `template_paymentlink`
- **File:** [`src/lib/emailService.ts`](file:///Users/lamaloay/Downloads/alvarolamawed-main/src/lib/emailService.ts)
