# Real Estate Powerhouse

Real Estate Powerhouse is a mobile-first React app for exploring every 2025 Staten Island property sale recorded by the NYC Department of Finance. Sales of $0 and other non-market transfers (under $10,000) are left out. Built for CSC 436 Project 3 (Async React).

**Live site:** https://real-estate-powerhouse.netlify.app

## Features

- **Market snapshot:** the six Staten Island neighborhoods with the most 2025 sales, each with its sale count and median home price (one- to three-family homes, condos, and co-ops).
- **Live search:** type part of an address or a ZIP code and the list updates as you type.
- **Filters and sorting:** filter by neighborhood, property type, and price range, and sort by newest, price high to low, or price low to high. "Clear filters" resets everything.
- **Property detail with comparable sales nearby:** open any sale to see its full details, an "Open in Google Maps" link, and up to eight 2025 sales of the same property type within about half a mile, with their median price.

## API used

[NYC Citywide Annualized Calendar Sales Update](https://catalog.data.gov/dataset/nyc-citywide-annualized-calendar-sales-update), from NYC Open Data (NYC Department of Finance).

- Endpoint: https://data.cityofnewyork.us/resource/w2pb-icbu.json
- No API key is needed. Queries use Socrata's SoQL parameters (`$select`, `$where`, `$group`, `$order`, `$limit`), built with `URLSearchParams`.
- The app makes three kinds of request: every 2025 Staten Island sale for the list, one grouped request for the market snapshot (using SoQL's `median()`), and one request for the comparable sales of the property you open.

## How to trigger the error state

Turn on the **Simulate API failure** switch near the top of the page, just below the header. A second copy of the switch sits at the bottom of the property dialog, because the page behind an open dialog can't be clicked.

- While the switch is on, every request goes to the real API address with an invalid dataset id. Each request really fails with a 404, so this is not a fake error.
- Each section then shows its own error panel with a readable message ("NYC Open Data didn't respond (error 404). Please try again.") and a **Retry** button.
- **Retry** sends the request again. While the switch is on, the retry fails again, so you can watch the loading skeleton come back and then the error. Turn the switch off and every section reloads the real data on its own. If a request fails for a real reason, such as a dropped connection, Retry is how you recover.
- While the switch is on, the browser console shows "Failed to load resource: the server responded with a status of 404". That message only appears while the switch is on, because a real request is being made to a broken URL. With the switch off, the console is clean.

## How the app handles async data

- **useFetch hook:** `useFetch(url)` returns `{ data, loading, error, retry }` and is used by three components (MarketSnapshot, SalesList, and PropertyDetail). Its effect depends only on primitives (the URL string, the failure switch, and a retry counter). It cancels in-flight requests with `AbortController` when they're no longer needed. Passing `null` as the URL skips fetching, which is how the dialog fetches nothing until a sale is opened.
- **The three states:** every fetch shows a skeleton while loading, an error panel with a message and Retry if it fails, and the data when it arrives. A designed empty state appears when there's nothing to show, so the screen is never blank.
- **Derived-view filtering:** the sales are fetched once and kept as they arrived. On every render, the visible list is calculated from that data plus the current filters and sort, and the filtered list is never stored in state. Typing in the search box never triggers a new request.

## Tech stack

- React (function components and hooks)
- Vite
- Plain CSS (CSS variables, mobile-first media queries)
- Netlify (hosting)

## Run locally

```bash
git clone https://github.com/Anthonydosse777/real-estate-powerhouse.git
cd real-estate-powerhouse
npm install
npm run dev
```

## Project structure

| File | Description |
| --- | --- |
| `CLAUDE.md` | Project rules that Claude Code followed while building the app. |
| `AI-LOG.md` | Every AI prompt used to build the project, in order. |
| `src/main.jsx` | Entry point: renders `App` inside React's `StrictMode` and loads the global styles. |
| `src/App.jsx` | Page layout: skip link, header, failure switch, main sections, and footer, wrapped in the failure-switch provider. |
| `src/index.css` | Design tokens (colors, spacing, fonts) on `:root`, base styles, shared classes, and the reduced-motion rule. |
| `src/api/salesApi.js` | Builds every API URL and converts raw API rows into clean sale and neighborhood objects. |
| `src/hooks/useFetch.js` | The `useFetch(url)` hook: fetching, loading and error state, Retry, request cancelling, and the simulated failure. |
| `src/hooks/useSimulateFailure.js` | Reads the failure switch's on/off value and setter from context. |
| `src/context/failureContext.js` | Creates the React context that holds the failure switch's state. |
| `src/context/SimulateFailureContext.jsx` | Provider component that stores the failure switch's state for the whole app. |
| `src/lib/format.js` | Display helpers: title case, currency, dates, numbers, neighborhood name fixes, and lists of facts to show. |
| `src/lib/filterSales.js` | Pure search, filter, and sort functions, plus the filter options, for the sales list's derived view. |
| `src/lib/stats.js` | Small calculations: median price and price per square foot. |
| `src/components/Header.jsx` | House icon, gold wordmark, subtitle, and the one-line note about the data. |
| `src/components/Header.css` | Styles for the header. |
| `src/components/FailureSwitch.jsx` | The "Simulate API failure" switch (a native checkbox with `role="switch"`). |
| `src/components/FailureSwitch.css` | Styles for the switch and the bar it sits in. |
| `src/components/MarketSnapshot.jsx` | Market snapshot section: neighborhood stat cards with loading, error, and empty states. |
| `src/components/MarketSnapshot.css` | Stat cards: sideways scrolling on phones, a grid on larger screens. |
| `src/components/SalesList.jsx` | 2025 sales section: fetches the sales, holds the filter and sort state, shows the derived list, "Show more", and the detail dialog. |
| `src/components/SalesFilters.jsx` | Search box and the neighborhood, property type, price, and sort controls, plus "Clear filters". |
| `src/components/SalesFilters.css` | Filter layout: stacked on phones, two columns on tablets, one row on wide screens. |
| `src/components/SaleCard.jsx` | One sale card: price, address button that opens the details, neighborhood, type, date, and small facts. |
| `src/components/SaleCard.css` | Styles for sale cards. |
| `src/components/PropertyDetail.jsx` | The native `<dialog>` with a sale's full details, map link, comparable sales, and a failure switch. |
| `src/components/PropertyDetail.css` | Dialog styles: full screen on phones, a centered panel on larger screens. |
| `src/components/NearbySales.jsx` | "Comparable sales nearby" section in the dialog, with its median and all three states. |
| `src/components/Skeleton.jsx` | Loading placeholders shaped like sale cards, stat cards, or compact rows, announced to screen readers. |
| `src/components/Skeleton.css` | The placeholder shapes and the soft gold shimmer, which turns off under reduced motion. |
| `src/components/ErrorState.jsx` | Error panel (`role="alert"`) with an icon, title, readable message, and Retry button. |
| `src/components/EmptyState.jsx` | Empty-result panel with an icon, title, message, and an optional action button. |
| `src/components/Footer.jsx` | Data credit for NYC Open Data (NYC Department of Finance), linking to the dataset page. |

## AI usage

Claude and Claude Code were used to plan and build this project, and every prompt is recorded in [AI-LOG.md](AI-LOG.md).
