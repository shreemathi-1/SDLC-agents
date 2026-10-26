# T-01 dry run: A2 output (text only, no app code)

Source: input/sample_story.md (T-01, text user story). Figma: none. Screenshot: none.

## Input manifest (A2.01)
| ID | Type | Source |
|---|---|---|
| T-01 | Text user story | input/sample_story.md |

## Stories (A2.02)
- T-01.S1 As a shopper, I want to browse products and view product details, so that I can review items I may buy. (T-01 Expected Behavior 1-3)
- T-01.S2 As a shopper, I want to add products to a cart and see the cart indicator update, so that I know what I have chosen. (T-01 EB 4-5, 8)
- T-01.S3 As a shopper, I want a cart page with items, quantities, subtotals, and total, so that I can review my selection. (T-01 EB 6-10)

## Acceptance criteria (A2.03, Given/When/Then)
- AC1 Given the homepage, When it loads, Then a product list shows image, name, price, and a details/add button per product. (T-01 AC1, EB2)
- AC2 Given a product card, When the shopper opens details, Then image, name, price, description, and Add to Cart show. (T-01 AC2, EB3)
- AC3 Given a product, When Add to Cart is clicked, Then it is added, a confirmation shows, and the indicator shows total quantity. (T-01 AC3-4, AC9)
- AC4 Given a product already in the cart, When it is added again, Then its quantity increases with no duplicate row. (T-01 AC7, EB8)
- AC5 Given items in the cart, When the cart page opens, Then names, prices, quantities, subtotals, and total show. (T-01 AC5-6)
- AC6 Given an empty cart, When the cart page opens, Then an empty message and a link to the listing show. (T-01 EB10, AC8)
- iOS vs Android behavior: TBD (platforms TBD).

## Platform scope (A2.08), screens (A2.13), states (A2.14)
- Platforms: TBD. Framework: TBD (chosen later via A4.02 ADR, human approved).
- Screens: Home/listing, Product details, Cart. (T-01 EB1-7)
- States: loaded, empty cart (T-01 EB10). Loading, error, out-of-stock: TBD.

## Scope check (A2.17)
Out of scope per T-01: checkout, payment, auth, orders, discounts, inventory. No item here exceeds that.

## Clarifying questions (A2.04; no answer chosen)
1. Platform: web only, mobile only, or both? Options: web / mobile / both.
2. Cart persistence: none (in-memory), browser/device storage, or server. Options listed; none chosen.
3. Sample products: who supplies names, prices, images? Options: agent proposes (PROPOSED) / human supplies.
4. Currency and price format: TBD.

## Definition of Ready check (A2.05)
Team Definition of Ready text: TBD, so no pass/fail can be given. Result: NOT CHECKABLE. Awaiting approval: Product Owner (human).

## Open questions
See items 1-4 above and open-questions.md.
