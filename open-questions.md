# T-01 open-question record

## Resolved decisions

- Platform: web. (Source: T-01-DECISIONS, current chat)
- Framework: ReactJS and NodeJS. (Source: T-01-DECISIONS, current chat)
- Cart persistence: browser `localStorage`. Product Owner accepted on 2026-10-27. (Source: T-01-DECISIONS, current chat)
- Currency and price format: INR. (Source: T-01-DECISIONS, current chat)
- Sample product data: A2/A5 may create representative products. (Source: T-01-DECISIONS, current chat)
- Loading state: skeletons. Product Owner accepted on 2026-10-27. (Source: T-01-DECISIONS, current chat)
- Error state: retryable product-loading error. Product Owner accepted on 2026-10-27. (Source: T-01-DECISIONS, current chat)
- Out-of-stock state: unavailable product with Add to Cart disabled. Product Owner accepted on 2026-10-27. (Source: T-01-DECISIONS, current chat)

## Remaining open questions

1. **T-01-Q1 — Browser and OS scope:** TBD. Options: latest major desktop browsers only / include mobile browsers / explicit browser and OS matrix. Owner: Product Owner. (Source: T-01)
2. **T-01-Q2 — Offline behavior:** TBD. Options: cached data / retryable offline state / out of scope. Owner: Product Owner. (Source: T-01)
3. **T-01-Q3 — Permission-denied behavior:** TBD. Options: not applicable / generic access error / product-specific permission state. Owner: Product Owner. (Source: T-01)


## T-01 open questions: answered
1. Supported browsers and OS: **Browser only.** No native app, no OS-specific scope.
2. Offline behavior: **Not required.** Remove offline from the T-01 UX states and scope.
3. Permission-denied behavior: **Show a generic access error message.**
Decided by: Shree, [date]