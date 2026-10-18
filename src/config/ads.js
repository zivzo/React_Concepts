const client = import.meta.env.VITE_ADSENSE_CLIENT?.trim() ?? "";
const slotPattern = /^\d{6,20}$/;

function readSlot(value) {
  const slot = value?.trim() ?? "";
  return slotPattern.test(slot) ? slot : "";
}

const validClient = /^ca-pub-\d{10,20}$/.test(client) ? client : "";
const slots = {
  left: readSlot(import.meta.env.VITE_ADSENSE_SLOT_LEFT),
  right: readSlot(import.meta.env.VITE_ADSENSE_SLOT_RIGHT),
};
// Show labelled placeholders while developing so the layout can be checked without live ads.
const showPlaceholders = import.meta.env.DEV;

export const adsConfig = {
  client: validClient,
  slots,
  showPlaceholders,
  isTestMode: import.meta.env.DEV,
  hasSideRails: showPlaceholders || Boolean(validClient && (slots.left || slots.right)),
};

export const SIDE_RAIL_MEDIA_QUERY = "(min-width: 1280px)";
