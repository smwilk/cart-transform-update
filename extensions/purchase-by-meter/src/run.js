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

console.log("Function successfully ran!")

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  const operations = input.cart.lines.reduce(
    (acc, cartLine) => {
      const metafieldValue = getMetafieldValue(cartLine);
      const purchasedUnit = getPurchasedUnit(cartLine);

      if (metafieldValue && purchasedUnit) {
        const updatedPrice = metafieldValue * purchasedUnit;
        const updateOperation = createUpdateOperation(cartLine.id, updatedPrice);
        acc.push(updateOperation);
      }

      return acc;
    },
    []
  );

  return { operations };
}

function createUpdateOperation(cartLineId, updatedPrice) {
  return {
    update: {
      cartLineId,
      price: {
        adjustment: {
          fixedPricePerUnit: {
            amount: updatedPrice.toString()
          }
        }
      }
    }
  };
}

function getPurchasedUnit({ isPreOrder }) {
  if (isPreOrder && isPreOrder.value) {
    return parseInt(isPreOrder.value);
  }

  return null;
}



function getMetafieldValue({ merchandise }) {
  if (
    merchandise &&
    merchandise.__typename === 'ProductVariant' &&
    merchandise.preorder_price &&
    merchandise.preorder_price.value
  ) {
    return parseInt(merchandise.preorder_price.value);
  }

  return null;
}