// @ts-check

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
  const operations = [];

  for (const cartLine of input.cart.lines) {
    const metafieldValue = getMetafieldValue(cartLine);
    const purchasedUnit = getPurchasedUnit(cartLine);
    console.log("reached this point cartline", JSON.stringify(cartLine))

    if (metafieldValue && purchasedUnit) {
      console.log("reached this point 2")
      const updatedPrice = metafieldValue * purchasedUnit;
      const updateOperation = createUpdateOperation(cartLine.id, updatedPrice);
      operations.push(updateOperation);
    }
  }

  return { operations };
}

function createUpdateOperation(cartLineId, updatedPrice) {
  console.log("reached this point 3")
  return {
    update: {
      cartLineId,
      price: {
        adjustment: {
          fixedPricePerUnit: {
            amount: updatedPrice.toString(),
          },
        },
      },
    },
  };
}

function getPurchasedUnit({ isPreOrder }) {
  if (isPreOrder?.value) {
    return parseFloat(isPreOrder.value);
  }

  return null;
}

function getMetafieldValue({ merchandise }) {
  if (
    merchandise?.__typename === 'ProductVariant' &&
    merchandise.preorder_price?.value
  ) {
    return parseFloat(merchandise.preorder_price.value);
  }

  return null;
}