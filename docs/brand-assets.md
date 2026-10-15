# Brand assets and illustrative photography

Updated 15 October 2026. Brand marks were obtained from the first-party sources below, not reconstructed with a font or traced from a screenshot. XML declarations and editor comments may be removed; logo geometry and brand colors are preserved. Social glyph geometry is also embedded in `src/brand-marks.mjs` so it works on all nested GitHub Pages routes.

| Asset | Official source | Published format |
| --- | --- | --- |
| WhatsApp | https://static.whatsapp.net/rsrc.php/y1/r/FJbTMJqMap7.svg (linked from https://www.whatsapp.com/) | SVG |
| Instagram | https://about.meta.com/brand/resources/instagram/instagram-brand/ → brand download → `01 Static Glyph/03 Black Glyph/Instagram_Glyph_Black.svg` | SVG |
| Kaspi.kz | https://kaspi.kz/img/Logo.svg | SVG |
| Halyk | https://halykbank.kz/storage/app/uploads/public/6a5/75a/f7a/6a575af7a9880610279451.svg (current header at https://halykbank.kz/) | SVG |
| Apple Pay | https://developer.apple.com/apple-pay/marketing/Apple-Pay-Mark.zip → `Apple Pay Mark/SVG/Apple_Pay_Mark_RGB_041619.svg` | SVG |
| Google Pay | https://developers.google.com/static/pay/api/download-assets/Google-Pay-Acceptance.zip → `Google Pay Mark/google-pay-mark_800.svg` | SVG |
| Samsung Pay | https://developer.samsung.com/pay/design → https://d3unf4s5rp9dfh.cloudfront.net/SAMSUNGWALLET/img-pay-logo-type01.png | Official PNG, 1176 × 520 |

Samsung's vector toolkit requires Samsung account sign-in. The website therefore uses the public official PNG, preserving the real logo, rather than a recreated SVG. Cash and bank-card interface symbols are original generic drawings and do not imply any specific card network.

The owner explicitly confirmed cash, Kaspi QR/transfer, Halyk/cards, Apple Pay, Google Pay and Samsung Pay on 15 October 2026. These methods are informational indicators in the footer only. No payment gateway or checkout exists. Confirmation remains controlled by `settings.paymentMethods[].confirmed`; unconfirmed or unknown entries are not rendered.

## Illustrative images

`public/assets/photos/` contains five original AI-generated still-life compositions: a glass anatomical foot sculpture, a synthetic practice model with instruments, generic insoles, correction practice materials and silicone orthoses. These do not depict Marina, staff, patients, actual clinic interiors, real training events or a photographed FootMaster product. An illustration disclosure appears alongside the course catalog. Portrait areas continue to use the existing nonphotographic brand illustration until the owner supplies actual photos.

The original generated PNGs are preserved in the creation workspace. Published WebP exports total approximately 600 KB. Images load locally; the hero receives high fetch priority, and course/detail images load lazily. No remote image service or runtime dependency was added.

## Motion and advertising

The hero uses a native WebGL 1 photograph texture with moving refractive folds, gentle chromatic dispersion and a pointer-responsive glass lens. Resolution and frame rate are capped; rendering pauses offscreen and in hidden tabs. Reduced-motion users receive a static image. WebGL failure/context loss retains the underlying image and CSS fallback.

Google Ads configuration was explicitly deferred by the owner. Existing optional analytics code remains unchanged, with empty account IDs and consent gating. No campaigns, tags or conversion labels have been activated by this update.
