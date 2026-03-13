describe("Dashboard interactions", () => {
  beforeEach(() => {
    // Intercept the Kraken REST OHLC call and return a minimal valid response
    cy.intercept("GET", "**/public/OHLC*", (req) => {
      const url = new URL(req.url);
      const pair = url.searchParams.get("pair") || "BTC/USD";
      req.reply({
        result: {
          [pair]: [
            [1700000000, "65000", "65100", "64900", "65000", "65000", "1.5", 10],
            [1700000060, "65000", "65200", "65000", "65100", "65100", "2.0", 15],
          ],
          last: 1700000060,
        },
        error: [],
      });
    }).as("ohlc");

    // Stub WebSocket before page code runs to avoid live connections
    cy.visit("/", {
      onBeforeLoad(win) {
        cy.stub(win, "WebSocket").as("wsStub");
      },
    });
  });

  it("changes the active timeframe when the 1d button is clicked", () => {
    cy.get("[aria-label='1 day']").click();
    cy.get("[aria-label='1 day']").should("have.class", "bg-gray-700");
  });

  it("changes the selected crypto pair via the dropdown", () => {
    cy.get("[aria-label^='Dropdown BTC/USD selected']").click();
    cy.get("[aria-label='Dropdown item: ETH/USD']").click();
    cy.get("[aria-label^='Dropdown ETH/USD']").should("exist");
  });

  it("increments the aggregation level when the + button is clicked", () => {
    cy.get("[aria-label='Increase aggregation']").click();
    cy.contains("0.05").should("be.visible");
  });
});
