import {brandMarks} from './brand-marks.mjs';
// Original interface icons, with first-party social brand marks.
const paths={
 cash:'<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M5 9h1m12 6h1"/>',
 card:'<rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 9h20M6 15h4"/>',
 arrow:'<path d="M5 19 19 5M5 5h14v14"/>',
 chevron:'<path d="m9 5 7 7-7 7"/>',
 external:'<path d="M14 4h6v6m0-6-9 9M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5"/>',
 phone:'<path d="m7 3 3 4-2 2c1.2 2.7 3.3 4.8 6 6l2-2 5 3c-1 4-3.4 5.2-7 3C8.8 16 5 12.2 3 7c-.6-2 1-4 4-4Z"/>',
 pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.7"/>',
 care:'<path d="M7 20c-2-4-3-6-1-10l3-6c1-2 3-1 2 1l-1 4m2-4c1-2 3-1 2 1l-1 3m3-2c1-1 3 0 1 2l-3 4c-2 3-1 5 0 7"/><path d="M5 16c4-2 7-2 9-1"/>',
 correction:'<path d="M6 20V9a6 6 0 0 1 12 0v11M9 4v7h6V4M4 14c5-4 11-4 16 0M5 18c4-2 10-2 14 0"/>',
 insoles:'<path d="M8 3c-4-1-5 4-4 7s-2 7-1 10c1 2 4 1 5-2l2-7c1-3 2-7-2-8Zm8 0c4-1 5 4 4 7s2 7 1 10c-1 2-4 1-5-2l-2-7c-1-3-2-7 2-8Z"/>',
 book:'<path d="M3 5c4-2 7-1 9 1 2-2 5-3 9-1v14c-4-2-7-1-9 1-2-2-5-3-9-1V5Zm9 1v14M6 8h3m6 0h3M6 12h3m6 0h3"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
 shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"/><path d="m8 12 3 3 5-6"/>'
};
export function icon(name,cls=''){const brand=brandMarks[name];if(brand)return `<svg class="icon brand-icon brand-${name} ${cls}" viewBox="${brand.viewBox}" fill="currentColor" stroke="none" aria-hidden="true">${brand.body}</svg>`;return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.arrow}</svg>`;}
