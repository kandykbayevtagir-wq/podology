# UI refinement, October 2026

The existing static generator, routes and GitHub Pages branch remain in place. No packages, backend services, payment processing or custom domains were added.

## User-facing changes

- Shared typography, card surfaces, navigation states and touch controls.
- Original SVG illustrations for the hero, services, training techniques and brand identity. The brand illustration is not a photograph or likeness of Marina.
- Recognizable Instagram, WhatsApp, phone, map and external-link icons.
- WhatsApp-only inquiry form with a published service/course selector, clinic selector and optional specialist/comment. The user still has to send the prepared message in WhatsApp.
- The advanced-training filter includes orthonyxia, insoles and orthoses; filter counts are announced to screen readers.
- RU/KK switching preserves the current route. Clinic card booking actions select the matching branch.

## Payment display

No acceptance of a payment method has been verified in project content. `settings.paymentMethods` therefore starts as an empty array. SVG badges exist in `public/assets/payments/`, but no payment section or payment names are rendered publicly.

After acceptance is confirmed, the owner may add an explicit record, for example `{ "id": "kaspi", "confirmed": true }`. Supported identifiers: `apple-pay`, `samsung-pay`, `google-pay`, `kaspi`, `halyk`. Unconfirmed or unknown records are ignored. This only displays an informational badge and never initiates a payment.

## Security and reliability

Detail-page titles and descriptions are escaped. Phone/WhatsApp targets are validated. Booking validates the chosen published item, branch, contact details and consent; message data is encoded as plain text into an HTTPS WhatsApp URL. No form submissions are sent to an API. Attribution parsing tolerates malformed browser storage. Personal information is not sent to analytics.

Legacy optional backend source files were not expanded or deployed; they are unrelated to the current GitHub Pages website.

## Pages workflow

The repository is configured to publish the `gh-pages` branch. The previous `main` workflow tried to deploy directly through a protected environment and failed. The updated workflow tests PRs, builds `main`, updates the existing `gh-pages` branch and explicitly requests its normal Pages build. It does not reconfigure hosting. PRs never receive publication permissions.
