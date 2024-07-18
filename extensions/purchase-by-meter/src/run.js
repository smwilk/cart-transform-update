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
    const amountPerQuantity = getAmountPerQuantity(cartLine);
    const purchasedUnit = getPurchasedUnit(cartLine);
    console.log("reached this point cartline", JSON.stringify(cartLine))

    if (amountPerQuantity && purchasedUnit) {
      console.log("reached this point 2")
      const updatedPrice = amountPerQuantity * purchasedUnit;
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

function getAmountPerQuantity({ cost }) {
  if (cost?.amountPerQuantity?.amount) {
    return parseFloat(cost.amountPerQuantity.amount);
  }

  return null;
}