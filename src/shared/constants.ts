import { Block } from "./Types";

export const BORDER_COLOR = "border-gray-500";

export const TRANSACTION_LIST_DROPPABLE_ID = "TRANSACTION_LIST";
export const BLOCK_DROPPABLE_PREFIX = "BLOCK_";
export const TRANSACTION_DRAGGABLE_PREFIX = "TRANSACTION_";

export const VALID_START_HASH = "0".repeat(3);
export const MAX_INITIAL_BALANCE = 1_000;
export const MAX_MINING_HASH_ITERATIONS = 1_000_000;

export const INITIAL_BLOCKS: Block[] = [
  {
    id: 0,
    prevHash: VALID_START_HASH,
    nonce: 0,
    transactions: [],
    confirmed: false,
  },
  {
    id: 1,
    nonce: 0,
    transactions: [],
    confirmed: false,
  },
];

export const TIME_FORMATTER_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};
