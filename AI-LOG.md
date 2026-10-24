# AI Log

Log of every AI prompt used to build this project, in order. Planning and prompt writing were done with Claude (claude.ai); code was generated with Claude Code using the prompts below.

## 2026-10-23 — Project setup and rules file
**Tool:** Claude Code

**Prompt:**
```text
Set up a new project for my CSC 436 Project 3: "Prospect Board", a mobile-first React app that explores 2025 Staten Island property sales from NYC Open Data, with a neighborhood market snapshot, live search and filters, and property details with nearby sales. Work through these parts in order.

PART 1 — Create the app
- In /Users/anthonydosse, create a Vite + React project (JavaScript, not TypeScript) named prospect-board and run npm install. If Vite asks setup questions, choose the standard React + JavaScript options and do NOT start the dev server.
- Remove all starter content so no unused files remain: delete src/assets/react.svg, public/vite.svg, the src/assets folder if it is then empty, and src/App.css (and its import).
- Replace App.jsx with a minimal component that renders <main><h1>Prospect Board</h1></main>.
- Replace index.css with only a small base reset: box-sizing border-box on everything, body margin 0, system-ui font stack.
- In index.html: set the title to "Prospect Board — Staten Island Real Estate", add a meta description, and replace the vite.svg favicon link with a new public/favicon.svg (a simple house icon) so there is no 404 in the console.
- Make sure .gitignore includes node_modules, dist, .env and .env.*.

PART 2 — Project rules file
Create CLAUDE.md with exactly the content between the two ==== lines.
====
# Prospect Board — rules for Claude Code

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
- One component per file in src/components/, hooks in src/hooks/, API code in src/api/, formatting helpers in src/lib/.
- Keep calculations out of display components; put them in helpers or hooks.
- No unused files, imports, variables, or commented-out code.

## CSS rules
- Mobile-first: design for phones first, then enhance for larger screens. Must look good from 320px to wide desktops.
- All colors, spacing, radii, shadows, and fonts are CSS variables defined once in :root. No repeated rules; reuse shared classes.
- Light and dark mode follow the device automatically with prefers-color-scheme. Do NOT build a theme toggle.
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
====

PART 3 — README
Create README.md with: the title "Prospect Board"; a two-sentence description (a mobile-first React app for exploring 2025 Staten Island property sales from NYC Open Data, with a neighborhood market snapshot, live search and filters, and property details with nearby sales); an "API used" section linking https://catalog.data.gov/dataset/nyc-citywide-annualized-calendar-sales-update; and "Run locally" steps (git clone, npm install, npm run dev). Do not add a live URL yet.

PART 4 — Check
Run npm run lint and npm run build; both must pass. Then show me the full file list (excluding node_modules and dist).
```

**Result:** Created the Vite + React project, removed the unused starter files, added a house favicon, the CLAUDE.md rules file, and the README. Lint and build passed.

## 2026-10-23 — Rename app
**Tool:** Claude Code

**Prompt:**
```text
Rename this app from "Prospect Board" to "Real Estate Powerhouse". The project folder has already been renamed to real-estate-powerhouse. Update:
- package.json and package-lock.json: change the "name" field from prospect-board to real-estate-powerhouse.
- index.html: set the title to "Real Estate Powerhouse — Staten Island Property Sales" and use the new name in the meta description.
- src/App.jsx: change the h1 text to "Real



## 2026-10-23 — Core app: data, useFetch, failure switch, design
**Tool:** Claude Code

**Prompt:**
```text
Build the core of the app. Read CLAUDE.md first and follow every rule in it. Work through these parts in order.

PART 0 — Update CLAUDE.md
- In "CSS rules", replace the line about light and dark mode with: "One black-and-gold theme on every device (black backgrounds, gold accents, warm white text). Do NOT build a theme toggle. Set color-scheme: dark. All text must meet WCAG AA contrast."
- In "Code rules", add src/context/ as the folder for React context.

PART 1 — Inspect the data before writing code
- Use curl on https://data.cityofnewyork.us/api/views/w2pb-icbu.json and report the data types of sale_price, sale_date, borough, neighborhood, building_class_category, land_square_feet, and gross_square_feet.
- Use curl to count Staten Island (borough=5) sales dated in 2025 with a sale_price of at least 10000.
- Use curl to test whether a $select + $group query works for per-neighborhood sale counts and average sale_price, and whether median() is supported.
- Use these findings to decide which filtering happens in the API query and which happens in JavaScript. Briefly tell me what you found.

PART 2 — API layer (src/api/salesApi.js) and helpers (src/lib/format.js)
- buildSalesUrl(): Staten Island, sale dates in 2025, real sales only (sale_price >= 10000), newest first, $select only the useful fields listed in CLAUDE.md, and a $limit high enough to return every matching row.
- buildMarketSnapshotUrl(): one aggregated request returning, for each Staten Island neighborhood in 2025, the number of real sales and the typical sale price of residential sales (one-, two-, and three-family homes, condos, and coops). Use median if supported, otherwise average, and label it accurately in the UI ("Median price" or "Average price").
- normalizeSale(row): converts one raw row into a clean object: id, address, unit, neighborhood, propertyType, zip, price, date, units, landSqft, grossSqft, yearBuilt, lat, lng, block, lot, bbl. Follow the data rules in CLAUDE.md. Missing values become null.
- normalizeNeighborhoodStat(row): converts one aggregated row into { neighborhood, salesCount, typicalPrice }.
- format.js: title case, currency ($1,130,000) and short currency ($1.13M), dates (Dec 31, 2025), numbers with commas, the neighborhood name corrections, and stripping the leading code from property types.

PART 3 — Failure switch and useFetch
- src/context/SimulateFailureContext.jsx: holds a simulateFailure boolean and its setter, provided at the top of the app.
- src/hooks/useFetch.js — useFetch(url) returns { data, loading, error, retry }:
  - If url is null, do nothing and return { data: null, loading: false, error: null }. (The property detail view will use this later.)
  - Use AbortController and abort in the effect cleanup. Ignore AbortError.
  - Check response.ok and throw an error that includes the HTTP status.
  - Read simulateFailure from context. When it is on, request a deliberately broken URL (the real request with an invalid dataset id) so the failure is a real failed request, not a fake one.
  - retry() increments a counter that is in the effect's dependency array.
  - The dependency array contains only primitives: url, simulateFailure, and the retry counter.
  - Turn errors into human-readable messages: if navigator.onLine is false, "You're offline. Check your connection and try again."; for HTTP errors, "NYC Open Data didn't respond (error 404). Please try again." with the real status code; otherwise a friendly general message.
- Components get raw data from useFetch and normalize it with useMemo, so no function or object ever goes into useFetch's dependency array.

PART 4 — Components (src/components/)
- Header.jsx: a small original house icon (inline SVG), the wordmark "Real Estate Powerhouse" in gold, and the subtitle "2025 Staten Island property sales".
- FailureSwitch.jsx: a native checkbox with role="switch" and a fixed visible label "Simulate API failure", plus the hint "Turn on to test the error screens." The label text never changes. It must be easy to find near the top of the page on every screen size.
- MarketSnapshot.jsx (section heading "Market snapshot"): uses useFetch(buildMarketSnapshotUrl()). Shows the top neighborhoods by number of sales as stat cards: neighborhood, number of sales, typical price. Cards scroll horizontally on phones and form a grid on larger screens. Loading shows skeleton stat cards; error shows ErrorState with Retry; no rows shows EmptyState.
- SalesList.jsx (section heading "2025 sales"): uses useFetch(buildSalesUrl()) and normalizes rows with useMemo. Shows the total count ("4,218 sales"). Shows 24 cards at first with a "Show more" button; store only the number of visible cards in state and slice the list during render. Loading shows 6 skeleton cards; error shows ErrorState with Retry; no rows shows EmptyState.
- SaleCard.jsx: an <article> showing the price (large, gold), address and unit as its heading, neighborhood, property type, sale date, and small facts (units, gross sq ft, year built). Skip any fact that is missing instead of showing "null", "NaN", or "0".
- Skeleton.jsx: one component with a variant prop ("sale" or "stat") that matches each card's shape, with a soft gold shimmer that turns off under prefers-reduced-motion. The loading wrapper has role="status" and visually hidden text like "Loading sales…".
- ErrorState.jsx: role="alert", an icon, a title, the human-readable message, and a Retry button that calls retry.
- EmptyState.jsx: an icon, a title, a message, and an optional action button (Prompt 3 will use this for "Clear filters").
- Footer.jsx: "Data: NYC Open Data (NYC Department of Finance), 2025 calendar-year sales", linking to https://catalog.data.gov/dataset/nyc-citywide-annualized-calendar-sales-update.
- App.jsx: wraps everything in the SimulateFailureContext provider. Layout: Header, FailureSwitch, then main with the MarketSnapshot section and the SalesList section, then Footer.

PART 5 — Design (index.css plus one CSS file per component where helpful)
- A polished luxury real-estate look in black and gold. Define everything as variables in :root, starting from: --color-bg #0b0b0c, --color-surface #151517, --color-surface-2 #1d1d20, --color-border #2c2c30, --color-gold #d4af37, --color-gold-light #e8cc7a, --color-text #f5f1e6, --color-text-muted #a9a49a, --color-danger #ff8a80, plus a spacing scale, radii, shadows, and font variables. Adjust shades if needed to pass WCAG AA contrast.
- Fonts: "Playfair Display" for headings and prices, "Inter" for body text, loaded from Google Fonts in index.html with preconnect and display=swap.
- Cards: dark surface, thin border, generous padding, rounded corners, gold border accent on hover and focus.
- A clearly visible gold focus outline on every interactive element.
- Mobile-first layout: one column on phones, two columns from about 640px, three from about 1024px, centered with a max width of about 1200px.
- A visually-hidden utility class for screen-reader-only text.

PART 6 — Check
Run npm run lint and npm run build; both must pass. Then tell me your PART 1 data findings and list every file you created, changed, or deleted.
```

**Result:** Added the NYC Open Data API layer and formatters, a reusable useFetch hook (AbortController, retry, readable errors), and a Simulate API failure switch. Built the market snapshot (median prices by neighborhood) and the 2025 sales list (4,498 sales) with skeleton, error, and empty states, styled in black and gold. Lint and build passed.


## 2026-10-23 — Search, filters, and property detail
**Tool:** Claude Code

**Prompt (first version):**
```text
Add search, filters, sorting, and a property detail view. Read CLAUDE.md first and follow every rule in it. Work through these parts in order.

PART 1 — Property groups (src/api/salesApi.js)
- Keep the original building class code when normalizing, and add a propertyGroup field to each sale based on that code. Use these groups: "1–3 family homes", "Condos & co-ops", "Rental buildings", "Land", "Commercial & other". Check which codes actually appear in the Staten Island 2025 data and map every one of them. Anything unmapped goes to "Commercial & other".

PART 2 — Filter and sort logic (src/lib/filterSales.js)
- A pure function filterSales(sales, filters) where filters is { search, neighborhood, propertyGroup, priceRange }. Search matches address or ZIP, is case-insensitive, and ignores extra spaces.
- Price ranges: Any price, Under $500K, $500K–$750K, $750K–$1M, $1M–$2M, $2M+.
- A pure function sortSales(sales, sortBy) with "newest", "price-high", and "price-low".
- A helper that returns the list of neighborhoods present in the data, sorted A to Z.

PART 3 — Filters UI (src/components/SalesFilters.jsx)
- Controls, each with a visible label: "Search address or ZIP" (text input), Neighborhood (select, "All neighborhoods" plus the neighborhoods from the data), Property type (select, "All types" plus the five groups), Price (select with the ranges), and Sort (select).
- A "Clear filters" button that only appears when any filter is active.
- Mobile-first: controls stack on phones and sit in a row on wide screens. Every control is at least 44px tall.
- In SalesList: keep the filter values and sort in state. Compute the visible list during render (derived view) by calling filterSales then sortSales. Never store the filtered list in state. Typing filters the already-fetched data and never triggers a fetch.
- Show "Showing 312 of 4,498 sales" in an element with aria-live="polite".
- Reset the "Show more" count back to 24 inside the filter change handlers, not in a useEffect.
- When nothing matches, show EmptyState with the title "No sales match these filters", a short message, and a "Clear filters" action button.

PART 4 — Property detail (src/components/PropertyDetail.jsx)
- Each SaleCard gets a clearly labeled button (the address can be the button text) that opens the detail view. Store only the selected sale's id in state and look up the sale from the fetched list during render.
- Use a native <dialog> opened with showModal(). It closes with a Close button, the Escape key, and a click on the backdrop. Focus moves into the dialog when it opens and returns to the button that opened it when it closes. On phones it fills the screen; on wide screens it is a centered panel with a max width.
- Show: price, address and unit, neighborhood, ZIP, property type and group, sale date, units, land sq ft, gross sq ft, price per gross sq ft (only when sq ft is available), year built, block and lot, and an "Open in Google Maps" link using latitude and longitude (opens in a new tab with rel="noopener noreferrer"; hide it if coordinates are missing).
- "Nearby sales" section: a second useFetch with buildNearbySalesUrl(sale) in salesApi.js. It returns 2025 real sales in the same property group within about half a mile, using a latitude/longitude bounding box, falling back to the same neighborhood when coordinates are missing. Newest first, limit 8, excluding this sale. Show each as a compact row (address, price, date, price per sq ft when available) plus a summary line "Median of nearby sales: $X" computed from the results. Loading shows skeleton rows, error shows ErrorState with Retry, and no results shows EmptyState ("No similar sales nearby in 2025").
- "Sale history" section: a third useFetch with buildSaleHistoryUrl(bbl), returning every recorded sale of this exact property across all years in the dataset, newest first, real sales only. Show date and price for each. Same three states; when the 2025 sale is the only one, show "No earlier sales on record".
- Pass useFetch either a URL string or null (when no sale is selected). Never pass an object.

PART 5 — Number styling
- Make all prices, counts, and stats use even-height, equal-width digits (font-variant-numeric: lining-nums tabular-nums) through one shared class or variable.

PART 6 — Check
- The Simulate API failure switch must also break the nearby sales and sale history requests, and Retry must work in the dialog.
- Run npm run lint and npm run build; both must pass. Then list every file you created, changed, or deleted, and the property-type codes you found with the group each maps to.
```

**Prompt (revised version, removes Sale history):**
```text
Add search, filters, sorting, and a property detail view. Read CLAUDE.md first and follow every rule in it. Work through these parts in order.

PART 1 — Property groups (src/api/salesApi.js)
- Keep the original building class code when normalizing, and add a propertyGroup field to each sale based on that code. Use these groups: "1–3 family homes", "Condos & co-ops", "Rental buildings", "Land", "Commercial & other". Check which codes actually appear in the Staten Island 2025 data and map every one of them. Anything unmapped goes to "Commercial & other".

PART 2 — Filter and sort logic (src/lib/filterSales.js)
- A pure function filterSales(sales, filters) where filters is { search, neighborhood, propertyGroup, priceRange }. Search matches address or ZIP, is case-insensitive, and ignores extra spaces.
- Price ranges: Any price, Under $500K, $500K–$750K, $750K–$1M, $1M–$2M, $2M+.
- A pure function sortSales(sales, sortBy) with "newest", "price-high", and "price-low".
- A helper that returns the list of neighborhoods present in the data, sorted A to Z.

PART 3 — Filters UI (src/components/SalesFilters.jsx)
- Controls, each with a visible label: "Search address or ZIP" (text input), Neighborhood (select, "All neighborhoods" plus the neighborhoods from the data), Property type (select, "All types" plus the five groups), Price (select with the ranges), and Sort (select).
- A "Clear filters" button that only appears when any filter is active.
- Mobile-first: controls stack on phones and sit in a row on wide screens. Every control is at least 44px tall.
- In SalesList: keep the filter values and sort in state. Compute the visible list during render (derived view) by calling filterSales then sortSales. Never store the filtered list in state. Typing filters the already-fetched data and never triggers a fetch.
- Show "Showing 312 of 4,498 sales" in an element with aria-live="polite".
- Reset the "Show more" count back to 24 inside the filter change handlers, not in a useEffect.
- When nothing matches, show EmptyState with the title "No sales match these filters", a short message, and a "Clear filters" action button.

PART 4 — Property detail (src/components/PropertyDetail.jsx)
- Each SaleCard gets a clearly labeled button (the address can be the button text) that opens the detail view. Store only the selected sale's id in state and look up the sale from the fetched list during render.
- Use a native <dialog> opened with showModal(). It closes with a Close button, the Escape key, and a click on the backdrop. Focus moves into the dialog when it opens and returns to the button that opened it when it closes. On phones it fills the screen; on wide screens it is a centered panel with a max width.
- Show: price, address and unit, neighborhood, ZIP, property type and group, sale date, units, land sq ft, gross sq ft, price per gross sq ft (only when sq ft is available), year built, block and lot, and an "Open in Google Maps" link using latitude and longitude (opens in a new tab with rel="noopener noreferrer"; hide it if coordinates are missing).
- "Comparable sales nearby" section: a second useFetch with buildNearbySalesUrl(sale) in salesApi.js. It returns 2025 real sales in the same property group within about half a mile, using a latitude/longitude bounding box, falling back to the same neighborhood when coordinates are missing. Newest first, limit 8, excluding this sale. Show each as a compact row (address, price, date, price per sq ft when available) plus a summary line "Median of nearby sales: $X" computed from the results. Loading shows skeleton rows, error shows ErrorState with Retry, and no results shows EmptyState ("No similar sales nearby in 2025").
- Pass useFetch either a URL string or null (when no sale is selected). Never pass an object.

PART 5 — Number styling
- Make all prices, counts, and stats use even-height, equal-width digits (font-variant-numeric: lining-nums tabular-nums) through one shared class or variable.

PART 6 — Check
- The Simulate API failure switch must also break the comparable sales request, and Retry must work in the dialog.
- Run npm run lint and npm run build; both must pass. Then list every file you created, changed, or deleted, and the property-type codes you found with the group each maps to.
```

**Result:** The first version added property groups, live search, filters, sorting, and a property detail dialog with nearby sales and sale history. The revised version removed the sale history section, renamed the nearby section to "Comparable sales nearby", and added a failure switch inside the dialog so errors can be tested while it is open. Lint and build passed.

## 2026-10-24 — Final audit, polish, and README
**Tool:** Claude Code

**Prompt:**
```text
Final pass before submission. Read CLAUDE.md first and follow every rule in it. Do NOT add new features. Only audit, fix, polish, and document. Work through these parts in order.

This is graded with this rubric (100 points):
- Three States Pattern (30): all three states implemented and visible for every fetch; no blank screens
- useEffect and custom hook (20): correct dependencies, no request loops, clean reusable hook
- API integration (15): data fetched, parsed, and displayed correctly
- Search or filter (10): works correctly and updates the view live
- Code quality (10): readable, well-organized, no console errors
- Repository and deployment (10): meaningful history, README lists the API used, live URL works
- User experience (5): loading and error states feel considered, not bolted on
Points were lost on past projects for: a toggle that announced its state twice to screen readers, repeated CSS rules, images not lazy-loading, placeholder content, an incomplete README file table, leftover unused files, and a CSS rule that depended on placeholder text.

PART 1 — Audit (report before fixing)
Check every item and note what you find:
1. Three states: list every fetch in the app (market snapshot, sales list, comparable sales). For each, confirm a loading state, an error state with a readable message and Retry, a data state, and a designed empty state. Look for any moment that could show a blank screen, including the first render and the dialog when its sale can't be found.
2. useEffect: list every useEffect in the codebase with its dependency array. Confirm there are no request loops, no objects, arrays, or functions in dependency arrays, no fetching on keystrokes, and AbortController cleanup in useFetch. Remove any effect that isn't needed. Confirm useFetch is used by at least two components.
3. Data: confirm prices, dates, sq ft, and missing values display correctly. Fetch every Staten Island neighborhood name in the data and add corrections for any that are cut off at 20 characters. Check title case on addresses with units, numbered streets (1st, 2nd), and names like "St." or "Mc".
4. Search and filters: confirm they update live, use the derived-view pattern, and never store the filtered list in state.
5. Code quality: find unused files, exports, imports, variables, CSS classes, and any console.log. Find duplicate or repeated CSS rules and consolidate them into shared classes or variables. Confirm there are no React warnings (keys, controlled inputs, etc.).
6. Accessibility: every img has alt, loading="lazy", width, and height; every input has a visible label; errors use role="alert"; loading uses role="status"; the dialog has an accessible name; heading levels go in order (h1, then h2, then h3); focus is visible everywhere; tap targets are at least 44px; text contrast passes WCAG AA, especially gold and muted text on black; no element combines a changing visible label with aria-pressed. Add a "Skip to main content" link if there isn't one.
7. Layout: check widths of 320px, 375px, 768px, and 1280px. No horizontal scrolling at 320px, nothing overlapping, and consistent spacing. If you have a browser tool available, use it to look at each width.
8. Content: no placeholder text and no dead links. Near the top of the page, add one short line that explains the data: all 2025 Staten Island sales recorded by the NYC Department of Finance, with $0 and non-market transfers excluded.

PART 2 — Fix
Fix everything found in PART 1. Keep every fix small and do not change how features work.

PART 3 — README
Rewrite README.md so it is complete and accurate. Keep the existing live site line exactly as it is. Include:
- Title and a short description
- Live site (keep the existing line)
- Features: market snapshot, live search, filters and sorting, property detail with comparable sales nearby
- API used: NYC Open Data "NYC Citywide Annualized Calendar Sales Update", with a link to https://catalog.data.gov/dataset/nyc-citywide-annualized-calendar-sales-update, the endpoint https://data.cityofnewyork.us/resource/w2pb-icbu.json, and a note that no API key is needed
- How to trigger the error state: the "Simulate API failure" switch near the top of the page, and the one inside the property dialog. Explain what happens and how Retry works. Mention that the browser console shows "Failed to load resource" only while the switch is on, because a real request is being made to a broken URL.
- How the app handles async data: one or two sentences each on the useFetch hook, the three states, and the derived-view filtering
- Tech stack: React, Vite, plain CSS, Netlify
- Run locally: git clone, npm install, npm run dev
- Project structure: a table listing EVERY file in src/ plus CLAUDE.md and AI-LOG.md, each with a one-line description
- AI usage: one sentence noting that Claude and Claude Code were used, with every prompt recorded in AI-LOG.md

PART 4 — Final check
- Run npm run lint and npm run build; both must pass with no warnings.
- Then give me a scorecard: each rubric category, its points, your honest estimated score, and the evidence (file names). After that, list every fix you made and every file you created, changed, or deleted.
```

**Result:** Audited the app against the rubric and past mistakes. Fixed a blank dialog case, title case for names like McArthur and O'Connor, heading levels in the dialog, and screen reader reading of units; added a skip link and a data note; consolidated repeated CSS into shared classes; deleted an empty leftover file; and rewrote the README with a complete file table. Lint and build passed.