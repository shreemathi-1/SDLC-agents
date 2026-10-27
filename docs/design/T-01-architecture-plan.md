# T-01 architecture plan

Status: Approved by Product Owner for the design phase on 2026-10-27.  
Source IDs: T-01, T-01-DECISIONS, T-01-ui-spec.  
Scope: thin-slice web app for product browsing, product details, add-to-cart, and cart review.

## 1. Context

The product requirement is a simple web shopping flow with a product listing, product detail page, `Add to Cart` action, cart indicator, and cart review page. The approved design is text-only and uses browser `localStorage` for cart persistence, INR pricing, and a product list backed by sample data. Source: T-01, T-01-DECISIONS, T-01-ui-spec.

## 2. ADR: framework and app shape

### Decision summary

- Front-end framework: ReactJS
- Runtime/tooling: NodeJS for the web app toolchain and scripts
- Storage model: browser `localStorage` for cart persistence
- Data source: static product catalog in the app (sample product data)
- Delivery model: client-side web app, no server-side checkout or auth in the first slice

### Options considered

1. Option A: Single-page React app with static product data and `localStorage` cart state.
   - Pros: simplest path for the thin slice; matches the product flow and local cart requirement; no payment or auth complexity.
   - Cons: no server-side API; cart persistence is browser-scoped and not shared across devices.
2. Option B: React frontend + Node/Express API + database-backed cart and catalog.
   - Pros: scalable and more realistic for commerce flows.
   - Cons: exceeds scope of the thin slice; introduces API, persistence, and deployment overhead not required by T-01.

### Decision

Option A is the selected approach for the initial slice. It meets the approved user story, keeps the implementation focused, and avoids features out of scope. Source: T-01, T-01-DECISIONS.

### Consequences

- Positive: minimal complexity, faster delivery, strong match to the product requirement, browser cart persistence works in the same browser.
- Negative: cart state is not shared across browsers or devices; no server-side catalog or checkout is available.
- Risk: product data and persistence failure handling need explicit UI states during implementation. Source: T-01-ui-spec.

## 3. Application architecture

### Layers

1. Presentation layer
   - Product listing page
   - Product details page
   - Cart page
   - Shared header and cart badge
2. State layer
   - React state for current product selection, cart, and UI states
   - `localStorage` adapter for cart persistence
3. Domain layer
   - product model
   - cart model with quantity updates
   - pricing/computation helpers (INR subtotal and total)
4. Data layer
   - static product catalog file or in-memory mock dataset
   - cart serialization/deserialization to `localStorage`

### Module boundaries

- `src/pages`: listing, details, cart screens
- `src/components`: header, product card, cart line, totals panel, empty/error states
- `src/features/cart`: cart reducer/store helper, localStorage sync
- `src/features/products`: product catalog and product selection data
- `src/utils`: currency formatting, price calculations, storage helpers
- `src/styles`: design tokens and layout rules

### State approach

Use a small React state model with a single cart store and derived totals. No global state framework is required for this slice; a reducer or simple context is sufficient. Source: T-01-ui-spec, T-01-DECISIONS.

## 4. Navigation and flow design

### Routes

- `/` — product listing
- `/product/:id` — product details
- `/cart` — cart review and total

### Flow map

- Listing -> details -> add to cart -> cart indicator update
- Listing -> details -> cart page via header/cart action
- Cart -> return to listing
- Cart -> quantity change and subtotal recalculation

Each route supports the approved UX flows from T-01 and the UI baseline in T-01-ui-spec. Source: T-01, T-01-ui-spec.

## 5. Data and persistence design

### Product data

- Sample product list contains name, image, price, availability, and description.
- Data is client-side static mock data; no backend API is required for the thin slice.

### Cart data

- Cart structure: array of records containing product id, quantity, and the latest selected price.
- `localStorage` keys: `cart.items` and optional `cart.version` if versioning is later required.
- Persistence behavior: save on cart change; restore on app load.
- Failure handling: UI should show a generic access or storage error if `localStorage` is unavailable or write fails. Source: T-01-DECISIONS, T-01-ui-spec.

## 6. API contract design

No backend API is required for the initial slice because the approved design uses static product data and browser cart storage. If a NodeJS API layer is introduced later, the minimal endpoints would be:

- `GET /products` — list product catalog
- `GET /products/:id` — single product payload
- `POST /cart` or `PUT /cart/:id` — cart updates (deferred when the backend is added)

These are future-phase interfaces and remain out of scope for the current thin slice. Source: T-01, T-01-DECISIONS.

## 7. Repo structure plan

```
project/
  docs/
    design/
  src/
    app/
    components/
    features/
      products/
      cart/
    pages/
    utils/
    styles/
  public/
    data/
    images/
  package.json
  README.md
```

This layout matches the thin-slice app scope and keeps product, cart, and presentation responsibilities separate. The repo template location is currently empty and is not used to define implementation structure in this doc; source: A4.06, project notes.

## 8. Task breakdown

Each task below maps to a story or approved design element and is sized as a single implementation unit for the thin slice.

| Task | Story ID | Scope |
|---|---|---|
| Set up React app shell and routing | T-01.S1 | App entry, route configuration |
| Implement product listing screen | T-01.S1 | Grid, card layout, loading/error states |
| Implement product details screen | T-01.S1 | Product image, price, description, Add to Cart |
| Implement cart store and localStorage adapter | T-01.S2, T-01.S3 | Add-to-cart, quantity updates, persistence |
| Implement cart page and totals | T-01.S3 | Items, subtotals, totals, empty state |
| Implement header and cart badge | T-01.S2, T-01.S3 | Cart indicator and navigation |
| Verify UI states against checklist | T-01 | Loading, error, empty, out-of-stock, success |

Source: T-01, T-01-ui-spec, A4.08.

## 9. Design validation checklist

| Check | Result |
|---|---|
| Requirements map to architecture | PASS |
| Route model fits approved UX | PASS |
| Cart persistence matches accepted decision | PASS |
| Scope remains within thin-slice boundary | PASS |
| No checkout/payment/auth features | PASS |
| Missing values recorded as TBD/open question | PASS |

## Open questions

1. Storage failure handling for `localStorage` remains TBD. Options: show generic error / continue in memory with warning / disable persistence. Owner: Product Owner. (T-01-DECISIONS)
2. Exact browser support and responsive breakpoints remain TBD. Owner: Product Owner/developer. (T-01-ui-spec)
3. Final sample product data and image assets remain TBD until A5 supplies representative values. Owner: A5 / Product Owner. (T-01)
