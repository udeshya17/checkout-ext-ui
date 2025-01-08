import {
  reactExtension,
  Banner,
  BlockStack,
  Text,
  useApi,
  useApplyAttributeChange,
  useInstructions,
  useTranslate,
  useSubtotalAmount,
} from "@shopify/ui-extensions-react/checkout";

// 1. Choose an extension target
export default reactExtension("purchase.checkout.header.render-after", () => (
  <Extension />
));

function Extension() {
  const translate = useTranslate();
  const { extension } = useApi();
  const instructions = useInstructions();
  const applyAttributeChange = useApplyAttributeChange();

  // 1. Use `useSubtotalAmount` to get the current subtotal
  const subtotalAmount = useSubtotalAmount() || 0; 
  console.log("Subtotal Amount:", subtotalAmount); 

  // 2. Check if the subtotal is less than 800
  const showWarningBanner = subtotalAmount.amount < 800;
  console.log("Show Warning Banner:", showWarningBanner); 

  // 2. Check instructions for feature availability
  if (!instructions.attributes.canUpdateAttributes) {
    console.log(
      "Attributes cannot be updated. Fallback UI will be rendered."
    ); 
    return (
      <Banner title="banner-ext" status="warning">
        {translate("attributeChangesAreNotSupported")}
      </Banner>
    );
  }

  // 3. Render the UI
  return (
    <BlockStack border={"dotted"} padding={"tight"}>
      {/* Used conditional rendering to show the banner */}
      {(showWarningBanner) ? 
      <Banner title="Attention!" status="critical">
      <Text style={{ color: "red" }}>
        Your subtotal is less than ₹800. Please add more items to proceed.
      </Text>
    </Banner>
    : ""  
    }
    </BlockStack>
  );

  async function onCheckboxChange(isChecked) {
    console.log("Checkbox Change Triggered:", isChecked); // Debug: Check checkbox value
    // 4. Call the API to modify checkout
    const result = await applyAttributeChange({
      key: "requestedFreeGift",
      type: "updateAttribute",
      value: isChecked ? "yes" : "no",
    });
    console.log("applyAttributeChange result", result); // Debug: Check API response
  }
}




