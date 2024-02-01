// @ts-check

/*
A straightforward example of a function that expands a bundle into its component parts.
The parts of a bundle are stored in a metafield on the product parent value with a specific format,
specifying each part's quantity and variant.

The function reads the cart. Any item containing the metafield that specifies the bundle parts
will return an Expand operation containing the parts.
*/

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 * @typedef {import("../generated/api").CartOperation} CartOperation
 */

/**
 * @type {FunctionRunResult}
 */
const NO_CHANGES = {
  operations: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const operations = input.cart.lines.reduce(
    /** @param {CartOperation[]} acc */
    (acc, cartLine) => {
      const updateOperation = optionallyBuildUpdateOperation(
        cartLine
      );

      if (updateOperation) {
        return [...acc, { update: updateOperation }];
      }

      return acc;
    },
    []
  );

  return operations.length > 0 ? { operations } : NO_CHANGES;
};

function optionallyBuildUpdateOperation(
  { id: cartLineId, merchandise, isPreOrder }
) {
  const hasPreorderPrice = merchandise.preorder_price && Number(merchandise.preorder_price.value) > 0 && isPreOrder?.value === 'yes';

  if (
    merchandise.__typename === "ProductVariant" &&
    hasPreorderPrice
  ) {
    return {
      cartLineId,
      title: `${merchandise.product.title} (PreOrder)`,
      price: {
        adjustment: {
          fixedPricePerUnit: {
            amount: (Number(merchandise.preorder_price.value)).toFixed(2)
          }
        }
      }
    };
  }

  return null;
}