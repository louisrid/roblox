/** CEOBLOX integration configuration.
 * Private draft: intentionally no production checkout or tracking is configured.
 * Set a verified external processor URL ONLY after completing a paid-order test.
 * Never point it to the former /pay or /thanks routes: those did not process payment.
 */
window.CEOBLOX_CONFIG = {
  checkoutUrl: "",
  previewOnly: true
};
