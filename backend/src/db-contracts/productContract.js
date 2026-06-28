// backend/src/db-contracts/productContract.js
// PURPOSE: Validate that product documents from the shared 'products' collection
//          have the fields Intern 2 depends on. Fail loudly, not silently.
// READ:    shared/schemas/product.schema.js for the full schema definition.

/**
 * Asserts that a product document satisfies Intern 2's required fields.
 * Throws a descriptive error if any required field is missing — this is intentional.
 * A crash here means a schema contract violation, not a code bug.
 *
 * @param {object} product - A product document retrieved from MongoDB
 * @throws {Error} DB_CONTRACT error with a clear message for the developer
 * @returns {true} if all required fields are present
 */
function assertProductContract(product) {
  if (!product) {
    throw new Error('DB_CONTRACT: product is null');
  }

  if (typeof product.baseShelfLifeDays === 'undefined') {
    throw new Error(
      `DB_CONTRACT: product "${product.name}" is missing baseShelfLifeDays. ` +
      `Contact Intern 1 to seed this field in Atlas.`
    );
  }

  if (typeof product.name === 'undefined') {
    throw new Error('DB_CONTRACT: product is missing required field "name"');
  }

  if (typeof product.isActive === 'undefined') {
    throw new Error(
      `DB_CONTRACT: product is missing required field "isActive". ` +
      `Contact Intern 1 to verify the products collection schema.`
    );
  }

  return true;
}

module.exports = { assertProductContract };
