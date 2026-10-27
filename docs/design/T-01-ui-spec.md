# T-01 UI/UX baseline

Status: **PROPOSED**; text-only input, no Figma or screenshot supplied.  
Source IDs: T-01, T-01-DECISIONS.  
Approver: Product Owner for design approval.

## 1. User journeys

1. Browse products -> open product details -> add an available product to cart. (T-01)
2. See cart indicator quantity -> open cart -> review lines, quantities, subtotals, and INR total. (T-01)
3. From an empty cart, return to the product listing. (T-01)

## 2. Screen and navigation baseline

| Screen | Entry | Primary action | Exit |
|---|---|---|---|
| Product listing | `/` | Open product details or add an available product | Details or cart |
| Product details | Product-card details action | Add available product to cart | Cart or listing |
| Cart | Header cart action | Review selection | Listing |

The header is shared across screens and contains the proposed site identity, listing navigation, and cart button with total-quantity badge. (T-01)

## 3. Proposed text wireframes

### Product listing

`Header: [PROPOSED brand] [Products] [Cart badge]`  
`Main: page title -> product grid -> product cards`  
Product card order: image, name, INR price, availability, details link, Add to Cart. (T-01, T-01-DECISIONS)

### Product details

`Header`  
`Main: back/listing link -> product image | name, INR price, description, availability, Add to Cart`  
After Add to Cart: visible confirmation feedback with a route to Cart. (T-01)

### Cart

`Header`  
`Main: page title -> cart line list -> totals panel`  
Each line: image, name, INR unit price, quantity, INR subtotal. Totals panel: INR total and return-to-listing action. Empty state replaces the line list and totals. (T-01)

## 4. States and feedback

| Surface | State | UI behavior |
|---|---|---|
| Listing | Loading | Skeleton cards; no misleading product content. (T-01-DECISIONS) |
| Listing | Error | Generic error message plus Retry action. (T-01-DECISIONS) |
| Listing/details | Out of stock | Availability label; Add to Cart disabled. (T-01-DECISIONS) |
| Listing/details | Loaded | Product content and enabled actions when available. (T-01) |
| Cart | Empty | Empty-cart message plus Return to products action. (T-01) |
| Cart | Loaded | Lines, quantities, subtotals, and INR total. (T-01) |
| Any screen | Permission denied | Generic access-error message. (T-01-DECISIONS) |
| Any screen | Offline | Not required; no offline UI is in scope. (T-01-DECISIONS) |
| Add to Cart | Success | Confirmation feedback; cart badge updates to total quantity. (T-01) |

Cart state persists in browser `localStorage`; storage failure behavior is **TBD** and is an open question. (T-01-DECISIONS)

## 5. Component specification

| Component | Props/data | States/variants |
|---|---|---|
| `SiteHeader` | brand, navigation, cart quantity | default; cart badge zero/non-zero |
| `ProductCard` | image, name, INR price, availability | available; out of stock; loading skeleton |
| `ProductGrid` | product collection | loaded; loading; error |
| `ProductDetails` | product image, name, INR price, description, availability | available; out of stock; permission error |
| `AddToCartButton` | product ID, availability | enabled; disabled; success feedback |
| `CartLine` | product, quantity, unit price, subtotal | standard |
| `CartSummary` | subtotal lines, INR total | populated; empty |
| `EmptyCartState` | return action | displayed when cart has no items |
| `ErrorState` | message, retry/action | retryable load error; generic access error |

Component names are implementation-neutral proposals and require design approval. (T-01)

## 6. Proposed design tokens

All values below are **PROPOSED** because no visual design source was supplied.

| Token | Proposed value | Reason |
|---|---|---|
| Page background | `#F8FAFC` | Separates content surfaces while remaining neutral |
| Surface | `#FFFFFF` | Clear cards and readable sections |
| Text | `#172033` | High-contrast primary text |
| Muted text | `#475467` | Supporting text with readable contrast |
| Primary | `#155EEF` | Clear interactive emphasis |
| Success | `#067647` | Confirmation feedback |
| Error | `#B42318` | Error messaging |
| Border | `#D0D5DD` | Visible component boundaries |
| Radius | `8px` | Consistent, restrained card/control shape |
| Spacing base | `8px` | Predictable spacing scale |
| Body text | `16px` | Comfortable default reading size |
| Heading scale | `24px`, `32px` | Distinguishes page and section hierarchy |

Primary text and button color combinations are selected to target the 4.5:1 normal-text contrast requirement; automated contrast verification is required during implementation. (A3.03)

## 7. Responsive layout

- Browser-only web scope; native-app safe areas and orientations are not applicable. (T-01-DECISIONS)
- Supported browser list and responsive breakpoint values are **TBD**; Product Owner/developer decision is required before implementation. (T-01)
- **PROPOSED** layout behavior: multi-column product grid on wide screens; fewer columns on narrow screens; details view stacks image above content; cart lines remain readable without horizontal clipping.
- Text must remain readable when browser text is zoomed; controls must retain visible labels. (A3.04)

## 8. Minimum UI/UX checklist

| Check | Baseline result | Evidence |
|---|---|---|
| One primary action per screen | PASS | Listing: browse/add; details: Add to Cart; cart: review/return. (T-01) |
| Required states represented | PASS | Loading, error, out-of-stock, empty, loaded, success, access error. (T-01, T-01-DECISIONS) |
| Visible labels | PASS | Details, Add to Cart, Retry, Return to products, Cart. (T-01) |
| Feedback after cart action | PASS | Confirmation feedback and badge update. (T-01) |
| Touch/control target size | TBD | Exact target size is not in the source; implementation must define and verify it. |
| Contrast | PROPOSED pass | Token pairings target 4.5:1; tool verification remains required. (A3.03) |
| Text scaling | PROPOSED pass | Remains browser text-scaling compatible; implementation verification required. |

## Open questions

1. Supported browser list and responsive breakpoints: **TBD**. Owner: Product Owner/developer. (T-01)
2. Behavior if browser `localStorage` is unavailable or write fails: **TBD**. Options: show a blocking error / continue in memory with a warning / treat persistence failure as out of scope. Owner: Product Owner. (T-01-DECISIONS)
3. Exact sample product content and image assets: **TBD** until A5 supplies representative data. (T-01)
4. Human design approval is pending. Approver: Product Owner. (R5)
