# GreenKart Storefront Test Plan

## Application Overview

Functional and exploratory test coverage for GreenKart (https://rahulshettyacademy.com/seleniumPractise/#/), an online produce storefront. The observed interface includes a 30-item catalog with per-product quantity controls, catalog search, a cart preview and summary, promo-code application, country and terms confirmation, and a Top Deals route with searchable, sortable, paginated offers and a delivery-date picker. Each test is independent and starts from a fresh browser context with an empty cart unless its steps explicitly create cart contents. No payment or customer-address entry was observed in the checkout flow. Cart currency is shown as ₹.

## Test Scenarios

### 1. Catalog and cart

**Seed:** `tests/seed.spec.ts`

#### 1.1. Load the catalog in a fresh state

**File:** `tests/catalog-and-cart/catalog-basics.spec.ts`

**Steps:**
  1. Start in a fresh browser context and open https://rahulshettyacademy.com/seleniumPractise/#/.
    - expect: The GreenKart catalog loads without a pre-existing cart.
    - expect: The page displays 30 product cards, each with a product name, price, quantity initialized to 1, decrement and increment controls, and an ADD TO CART button.
    - expect: The header cart summary shows 0 items and a price of 0.
  2. Scroll through the catalog from the first product to the last product.
    - expect: Product cards remain visible and actionable throughout the catalog, including the final listed item, Walnuts - 1/4 Kg.
    - expect: Product names, displayed package sizes, and prices remain paired with the correct product.

#### 1.2. Search for an existing product and clear the search

**File:** `tests/catalog-and-cart/catalog-search.spec.ts`

**Steps:**
  1. Start from a fresh catalog and enter Apple in the Search for Vegetables and Fruits field.
    - expect: The catalog filters to the Apple - 1 Kg product, with its price, quantity control, and ADD TO CART button available.
  2. Replace the query with an unmatched value such as xyz-not-a-product.
    - expect: The product cards are replaced by the no-results message, including guidance to enter a different keyword.
  3. Clear the search field.
    - expect: The full product catalog is restored and the cart remains empty.

#### 1.3. Adjust product quantity and enforce the lower boundary

**File:** `tests/catalog-and-cart/product-quantity.spec.ts`

**Steps:**
  1. Start from a fresh catalog and inspect the quantity control for Brocolli - 1 Kg.
    - expect: The quantity starts at 1.
  2. Activate the decrement control once while the quantity is 1.
    - expect: The quantity does not become zero or negative.
  3. Activate the increment control twice.
    - expect: The quantity increases to 3 and remains associated with Brocolli.
  4. Enter a non-numeric value and then a negative value directly in the quantity field, if the browser permits the input.
    - expect: The control rejects invalid values or prevents invalid quantities from being added to the cart; no invalid or negative total is produced.

#### 1.4. Add multiple products and verify cart totals

**File:** `tests/catalog-and-cart/add-items-and-cart-totals.spec.ts`

**Steps:**
  1. Start from a fresh catalog. Increase Brocolli - 1 Kg from quantity 1 to 2, then click its ADD TO CART button.
    - expect: The header shows one distinct item and a price total of ₹240.
    - expect: The cart contains Brocolli with quantity 2 and a line total of ₹240.
  2. Add one Cauliflower - 1 Kg at its default quantity.
    - expect: The cart shows two distinct products; the item count, per-line totals, and overall price total update consistently.
    - expect: The overall price total is ₹300 (2 × ₹120 plus 1 × ₹60).
  3. Open the cart preview from the cart icon.
    - expect: Both products and their quantities and line totals are visible.
    - expect: PROCEED TO CHECKOUT is available when the cart is non-empty.

#### 1.5. Remove cart items and verify the empty-cart state

**File:** `tests/catalog-and-cart/cart-removal-and-empty-state.spec.ts`

**Steps:**
  1. Start from a fresh catalog, add one product, and open the cart preview.
    - expect: The selected product appears in the cart with the correct quantity and amount.
  2. Use the remove control for that product.
    - expect: The removed product disappears and the cart item count and price return to 0.
    - expect: The empty-cart state is clear and checkout cannot proceed with no items.

#### 1.6. Review the checkout summary

**File:** `tests/catalog-and-cart/cart-checkout-summary.spec.ts`

**Steps:**
  1. Start from a fresh catalog, add two Brocolli and one Cauliflower, open the cart, and select PROCEED TO CHECKOUT.
    - expect: The application opens the cart summary route.
    - expect: The summary lists each product, quantity, unit price, and line total; the total amount is ₹300 and the item count reflects two distinct products.
    - expect: The promo-code field, Apply button, discount summary, and Place Order button are present.

### 2. Top Deals

**Seed:** `tests/seed.spec.ts`

#### 2.1. Browse offer pages and change page size

**File:** `tests/top-deals/offers-pagination-and-page-size.spec.ts`

**Steps:**
  1. Start from a fresh browser context, open the storefront, and select Top Deals.
    - expect: The offers view opens and displays a table with Veg/fruit name, Price, and Discount price columns.
    - expect: The default page size is 5, and the first page shows five offer rows.
  2. Select page 2, then use Next, Previous, First, and Last where enabled.
    - expect: The active page indicator and displayed offer rows update correctly for each navigation action.
    - expect: First and Previous are disabled on the first page; Next and Last are disabled on the last page.
    - expect: No rows are duplicated or omitted when moving between adjacent pages.
  3. Change the page size to 10 and then 20.
    - expect: The selected page size is applied, the visible row count respects the available results, and pagination recalculates correctly.

#### 2.2. Filter and sort the offers table

**File:** `tests/top-deals/offers-search-and-sort.spec.ts`

**Steps:**
  1. Start from a fresh Top Deals view and search for Mango.
    - expect: Only matching Mango offer rows remain visible, with their price and discount price.
  2. Replace the search query with an unmatched value.
    - expect: No unrelated offer rows are shown and the empty-results behavior is clear.
  3. Clear the search query and activate the Veg/fruit name, Price, and Discount price column headers in turn; activate each header again.
    - expect: Each activation sorts by that column and toggles between ascending and descending order.
    - expect: The displayed sort state reflects the active column and order, and rows are in the corresponding order.

#### 2.3. Select, clear, and validate a delivery date

**File:** `tests/top-deals/delivery-date-picker.spec.ts`

**Steps:**
  1. Start from a fresh Top Deals view and inspect the Delivery Date control.
    - expect: The date control displays the current selected date and exposes a calendar control.
  2. Open the calendar and select a valid date.
    - expect: The selected date is reflected by the date control in the expected format.
  3. Clear the date and attempt to enter an invalid or out-of-range date using the available date inputs.
    - expect: The date clears when the clear control is used.
    - expect: Invalid dates are rejected or normalized and do not leave contradictory values in the date control.

### 3. Checkout and order completion

**Seed:** `tests/seed.spec.ts`

#### 3.1. Reject an invalid promo code without changing totals

**File:** `tests/checkout/promo-code-validation.spec.ts`

**Steps:**
  1. Start from a fresh catalog, add two Brocolli, open the cart, and proceed to the order summary.
    - expect: The order summary shows a total amount of ₹240 and a discount of 0%.
  2. Enter INVALID2026 in the promo-code field and select Apply.
    - expect: The application finishes applying the code and displays an invalid-code message.
    - expect: The discount remains 0% and the total after discount remains ₹240.

#### 3.2. Apply a valid promo code when test data is available

**File:** `tests/checkout/valid-promo-code.spec.ts`

**Steps:**
  1. Start from a fresh catalog, add a product, open the cart, and proceed to the order summary.
    - expect: The order summary displays the pre-discount subtotal.
  2. Enter a valid promo code supplied by the product owner or test environment and select Apply.
    - expect: A successful application is communicated clearly.
    - expect: The discount percentage and total after discount are calculated correctly and consistently with the configured promotion.

#### 3.3. Require acceptance of Terms & Conditions

**File:** `tests/checkout/terms-validation.spec.ts`

**Steps:**
  1. Start from a fresh catalog, add one product, continue through the cart and order summary, and select Place Order.
    - expect: The country-selection step is displayed with a country dropdown, Terms & Conditions checkbox, and Proceed button.
  2. Select a valid country but leave the Terms & Conditions checkbox unchecked, then select Proceed.
    - expect: Checkout remains on the country-selection step.
    - expect: A clear required-terms validation message is displayed; no order is submitted.
  3. Check Terms & Conditions, then uncheck it and select Proceed again.
    - expect: The required-terms validation returns and checkout does not proceed.

#### 3.4. Complete checkout and verify the cart resets

**File:** `tests/checkout/successful-order.spec.ts`

**Steps:**
  1. Start from a fresh catalog, add at least one product, open the cart, proceed to the order summary, and select Place Order.
    - expect: The country-selection step is displayed.
  2. Select a valid delivery country, accept Terms & Conditions, and select Proceed.
    - expect: The application returns to the main catalog after confirmation.
    - expect: The cart is empty and the header shows 0 items and a price of 0.
    - expect: The flow does not leave the submitted order's products in a new cart.

#### 3.5. Open and return from the Terms & Conditions policy

**File:** `tests/checkout/terms-policy-navigation.spec.ts`

**Steps:**
  1. Start from a fresh catalog, add one product, continue to the country-selection step, and select the Terms & Conditions link.
    - expect: The policy route opens and displays policy content.
  2. Use browser navigation to return to checkout.
    - expect: The country-selection step remains usable and the cart/order state has not been unexpectedly altered.
