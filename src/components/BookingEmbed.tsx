import Script from "next/script";

// LeadConnector booking calendar. form_embed.js listens for the iframe's
// resize messages and sets its height, so the iframe only needs a
// min-height to hold the space until the calendar loads.
const CALENDAR_ID = "8Ft7wtCJn6cnlLlSWj9M";

export function BookingEmbed() {
  return (
    <>
      <iframe
        src={`https://api.leadconnectorhq.com/widget/booking/${CALENDAR_ID}`}
        allow="payment"
        style={{ width: "100%", border: "none", overflow: "hidden", minHeight: 600 }}
        scrolling="no"
        id={`${CALENDAR_ID}_1793647157514`}
        title="Book a strategy call"
      />
      <Script src="https://link.msgsndr.com/js/form_embed.js" strategy="afterInteractive" />
    </>
  );
}
