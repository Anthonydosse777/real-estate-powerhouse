# Real Estate Powerhouse — rules for Claude Code

## What this is
CSC 436 Project 3 (Async React). A mobile-first React + Vite app that explores 2025 Staten Island property sales, deployed on Netlify. Keep code simple and readable, with short comments where the logic isn't obvious.

## Grading requirements (all must be met)
- Every fetch shows all three states: loading (skeleton or spinner), error (human-readable message plus a Retry button), and data. Empty results get a designed empty state. Never a blank screen.
- A custom hook, useFetch(url), returns { data, loading, error, retry } and is used by at least two components.
- useEffect: correct dependency arrays, no request loops, never fetch on every keystroke. Never put objects or arrays created during render in a dependency array.
- Search/filter uses the derived-view pattern: store fetched data once and compute the filtered list during render. Never store the filtered list in state.
- The error state can be triggered on demand on the live site with a "Simulate API failure" switch.
- Zero console errors or warnings, including missing React keys.

## Data source
- NYC Open Data, "NYC Citywide Annualized Calendar Sales Update" (Socrata SODA API, no key): https://data.cityofnewyork.us/resource/w2pb-icbu.json
- Staten Island is borough=5. The newest sales end on 2025-12-31.
- Build query strings with URLSearchParams ($where, $order, $limit, $select).
- Every value comes back as a string. Convert numbers with Number(); strip commas from land_square_feet and gross_square_feet first.
- A sale_price of 0 or under $10,000 is a non-market transfer, not a real sale. Exclude these.
- Fields can be missing on some rows (for example apartment_number, residential_units). Handle missing values gracefully.
- Text is ALL CAPS: display it in title case. building_class_category starts with a code ("02 TWO FAMILY DWELLINGS"); strip the leading number for display.
- Some neighborhood names are cut off at 20 characters (for example "ROSSVILLE-PORT MOBIL" should be "Rossville-Port Mobile"). Keep one small lookup of corrections.
- Useful fields: neighborhood, building_class_category, address, apartment_number, zip_code, residential_units, total_units, land_square_feet, gross_square_feet, year_built, sale_price, sale_date, latitude, longitude, block, lot, bbl.
- Build a stable unique id for each sale from bbl and sale_date (add sale_price if needed for uniqueness). Never use array indexes as ids or keys.
- Raw API rows are converted into clean objects in one place (src/api/), so components never touch raw field names.

## Code rules
- ES modules only (import/export). Function components and hooks.
- One component per file in src/components/, hooks in src/hooks/, API code in src/api/, React context in src/context/, formatting helpers in src/lib/.
- Keep calculations out of display components; put them in helpers or hooks.
- No unused files, imports, variables, or commented-out code.

## CSS rules
- Mobile-first: design for phones first, then enhance for larger screens. Must look good from 320px to wide desktops.
- All colors, spacing, radii, shadows, and fonts are CSS variables defined once in :root. No repeated rules; reuse shared classes.
- One black-and-gold theme on every device (black backgrounds, gold accents, warm white text). Do NOT build a theme toggle. Set color-scheme: dark. All text must meet WCAG AA contrast.
- Style with class selectors only, never attribute selectors like [placeholder="..."].
- Respect prefers-reduced-motion for every animation.

## Accessibility rules
- Every img has meaningful alt text, loading="lazy", and width and height attributes.
- Error messages use role="alert"; loading regions use role="status" or aria-busy.
- Every input has a visible label. Interactive elements are real buttons or links, keyboard reachable, with a visible focus style. Tap targets are at least 44px.
- Never give an element a changing visible label AND aria-pressed, because screen readers then announce the state twice.

## Content rules
- No placeholder or lorem ipsum text and no dead links. The footer credits NYC Open Data (NYC Department of Finance).

## Workflow rules
- At the end of every task: run npm run lint and npm run build and fix anything that fails, then list every file you created, changed, or deleted.
