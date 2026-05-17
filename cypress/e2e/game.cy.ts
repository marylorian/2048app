const tileSelector = "[data-testid^='tile-']";
const arrowControlSelector =
  "[aria-label='Move up'], [aria-label='Move right'], [aria-label='Move down'], [aria-label='Move left']";

type A11yViolation = {
  description: string;
  id: string;
  impact: string | null;
  nodes: { target: string[] }[];
};

function visitGameWithAxe() {
  cy.visit("/");
  cy.injectAxe();
}

function visitTouchGame() {
  cy.visit("/", {
    onBeforeLoad(win) {
      Object.defineProperty(win.navigator, "maxTouchPoints", {
        configurable: true,
        value: 5
      });
    }
  });
}

function expectPlayableBoard() {
  cy.get("[data-testid='game-board']").should("be.visible");
  cy.get(tileSelector).its("length").should("be.gte", 2).and("be.lte", 16);
  cy.get(tileSelector).each(($tile) => {
    const value = Number($tile.text());

    expect(value).to.be.at.least(2);
    expect(Number.isInteger(Math.log2(value))).to.equal(true);
  });
}

function logA11yViolations(violations: A11yViolation[]) {
  cy.task(
    "table",
    violations.map(({ description, id, impact, nodes }) => ({
      description,
      id,
      impact,
      nodes: nodes.length,
      targets: nodes.map((node) => node.target.join(", ")).join("; ")
    }))
  );
}

describe("2048 game", () => {
  it("renders a playable board with no serious accessibility violations", () => {
    visitGameWithAxe();

    expectPlayableBoard();
    cy.checkA11y(
      undefined,
      {
        includedImpacts: ["critical", "serious"]
      },
      logA11yViolations
    );
  });

  it("accepts keyboard moves and keeps the board in a valid state", () => {
    visitGameWithAxe();

    cy.get("body").type("{leftarrow}{uparrow}{rightarrow}{downarrow}", {
      delay: 120
    });
    cy.wait(350);

    expectPlayableBoard();
    cy.get("[data-testid='score-score']").should("contain.text", "Score");
    cy.get("[data-testid='score-best']").should("contain.text", "Best");
    cy.checkA11y(
      undefined,
      {
        includedImpacts: ["critical", "serious"]
      },
      logA11yViolations
    );
  });

  it("restarts from the header control", () => {
    visitGameWithAxe();

    cy.get("body").type("{leftarrow}", { delay: 120 });
    cy.wait(350);
    cy.get("[aria-label='Start a new game']").click();

    expectPlayableBoard();
    cy.get("[data-testid='score-score']").should("contain.text", "0");
  });

  it("hides arrow controls on touch phones and tablets", () => {
    cy.viewport("iphone-x");
    visitTouchGame();
    cy.get(arrowControlSelector).should("not.exist");

    cy.viewport("ipad-2");
    visitTouchGame();
    cy.get(arrowControlSelector).should("not.exist");
  });
});
