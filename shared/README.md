# shared/ — Inter-Intern Contract Layer

This folder is the **contract layer** between Intern 1 and Intern 2.

- Neither intern owns it alone.
- Both interns read from it.
- **Neither intern modifies it without telling the other.**

---

## Contents

| File | Purpose | Owner |
|------|---------|-------|
| `schemas/product.schema.js` | Shape of the `products` collection | Both — agreed jointly |
| `constants/collections.js` | MongoDB collection name strings | Both — agreed jointly |

---

## ⚠️ The One Rule That Must Exist

> **Any change to the `products` collection schema — adding, removing, or renaming a field —
> requires a written message to the other intern with 24 hours notice before the change is made
> in Atlas. No exceptions.**

Without this rule, this folder is just decoration. With this rule, it is a real contract.

---

## How to Propose a Schema Change

1. **Write a message** to the other intern (WhatsApp / Slack / email) with:
   - What field you want to add / remove / rename
   - Why it's needed
   - Which of your services will break / benefit
2. **Wait 24 hours** for acknowledgement.
3. **Only then** update `product.schema.js` and make the change in Atlas.
4. **Update this README** if any new fields are added to the table above.

---

## Why This Exists

Intern 1 writes products to MongoDB Atlas.  
Intern 2 reads products from MongoDB Atlas.  

If Intern 1 renames `baseShelfLifeDays` to `shelfLife` without notice,  
Intern 2's expiry calculator silently returns `NaN` for every product.  
That is a production bug that takes hours to find.

This folder prevents that.
