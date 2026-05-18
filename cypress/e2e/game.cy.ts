const bestScoreKey = "react-native-2048:best-score";
const e2eStateKey = "react-native-2048:e2e-initial-state";
const tileSelector = "[data-testid^='tile-']";
const arrowControlSelector =
  "[aria-label='Move up'], [aria-label='Move right'], [aria-label='Move down'], [aria-label='Move left']";

type Board = number[][];

type SeedState = {
  board: Board;
  score?: number;
  gameState?: "playing" | "lost";
  hasShownWinAlert?: boolean;
  showArrowControls?: boolean;
  bestScore?: number;
};

type A11yViolation = {
  description: string;
  id: string;
  impact: string | null;
  nodes: { target: string[] }[];
};

const emptyBoard: Board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];

function visitGameWithAxe(seedState?: SeedState) {
  visitGame(seedState);
  cy.injectAxe();
}

function visitGame(seedState?: SeedState, maxTouchPoints = 0) {
  cy.visit("/", {
    onBeforeLoad(win) {
      win.localStorage.clear();

      Object.defineProperty(win.navigator, "maxTouchPoints", {
        configurable: true,
        value: maxTouchPoints
      });

      Object.defineProperty(win, "matchMedia", {
        configurable: true,
        value: (query: string) => ({
          addEventListener: () => undefined,
          addListener: () => undefined,
          dispatchEvent: () => false,
          matches: query.includes("pointer: fine") && maxTouchPoints === 0,
          media: query,
          onchange: null,
          removeEventListener: () => undefined,
          removeListener: () => undefined
        })
      });

      if (seedState?.bestScore !== undefined) {
        win.localStorage.setItem(bestScoreKey, String(seedState.bestScore));
      }

      if (seedState) {
        const { bestScore: _bestScore, ...state } = seedState;
        win.localStorage.setItem(e2eStateKey, JSON.stringify(state));
      }
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

function expectTile(value: number) {
  cy.get(`[aria-label^='${value} tile']`).should("exist");
}

function expectNoTile(value: number) {
  cy.get(`[aria-label^='${value} tile']`).should("not.exist");
}

function expectScore(value: number) {
  cy.get("[data-testid='score-score']").should("contain.text", String(value));
}

function expectBestScore(value: number) {
  cy.get("[data-testid='score-best']").should("contain.text", String(value));
}

function moveWithKeyboard(direction: "left" | "up" | "right" | "down") {
  cy.get("[data-testid='game-board']").should("be.visible");
  cy.get("body").type(`{${direction}arrow}`, { delay: 120 });
  waitForMove();
}

function swipeLeft() {
  cy.get("[data-testid='game-board']")
    .trigger("touchstart", {
      bubbles: true,
      cancelable: true,
      changedTouches: [
        { clientX: 320, clientY: 220, identifier: 1, pageX: 320, pageY: 220 }
      ],
      eventConstructor: "TouchEvent",
      force: true,
      targetTouches: [
        { clientX: 320, clientY: 220, identifier: 1, pageX: 320, pageY: 220 }
      ],
      touches: [
        { clientX: 320, clientY: 220, identifier: 1, pageX: 320, pageY: 220 }
      ]
    })
    .trigger("touchend", {
      bubbles: true,
      cancelable: true,
      changedTouches: [
        { clientX: 80, clientY: 220, identifier: 1, pageX: 80, pageY: 220 }
      ],
      eventConstructor: "TouchEvent",
      force: true,
      targetTouches: [],
      touches: []
    });
  cy.window().then((win) => {
    win.dispatchEvent(new Event("react-native-2048:e2e-swipe-left"));
  });
  waitForMove();
}

function waitForMove() {
  cy.wait(350);
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

function checkCriticalAndSeriousA11y(context?: string) {
  const options = {
    includedImpacts: ["critical", "serious"]
  };

  if (context) {
    cy.get(context).should("exist");
    cy.checkA11y(context, options, logA11yViolations);
    return;
  }

  cy.checkA11y(undefined, options, logA11yViolations);
}

describe("2048 game", () => {
  it("renders a playable board with no serious accessibility violations", () => {
    visitGameWithAxe();

    expectPlayableBoard();
    checkCriticalAndSeriousA11y();
  });

  it("merges tiles with keyboard controls and persists the best score", () => {
    visitGameWithAxe({
      board: [[2, 2, 0, 0], ...emptyBoard.slice(1)],
      bestScore: 0
    });

    moveWithKeyboard("left");

    expectTile(4);
    expectScore(4);
    expectBestScore(4);
    cy.window()
      .its("localStorage")
      .invoke("getItem", bestScoreKey)
      .should("equal", "4");
    checkCriticalAndSeriousA11y();
  });

  it("supports desktop arrow buttons", () => {
    visitGame({
      board: [[2, 2, 0, 0], ...emptyBoard.slice(1)],
      showArrowControls: true
    });

    cy.get("[aria-label='Move left']").should("be.visible").click();
    waitForMove();

    expectTile(4);
    expectScore(4);
  });

  it("supports swipe gestures", () => {
    visitGame({
      board: [[2, 2, 0, 0], ...emptyBoard.slice(1)]
    });

    swipeLeft();

    expectTile(4);
    expectScore(4);
  });

  it("shows the 2048 modal and continues play toward 4096", () => {
    visitGameWithAxe({
      board: [[1024, 1024, 0, 0], ...emptyBoard.slice(1)]
    });

    moveWithKeyboard("left");

    cy.get("[data-testid='win-modal']").should("be.visible");
    cy.contains("2048!").should("be.visible");
    cy.contains("Continue").click();
    cy.get("[data-testid='win-modal']").should("not.exist");
    expectScore(2048);

    visitGame({
      board: [[2048, 2048, 0, 0], ...emptyBoard.slice(1)],
      hasShownWinAlert: true
    });

    moveWithKeyboard("left");

    expectTile(4096);
    expectNoTile(2048);
    expectScore(4096);
    cy.get("[data-testid='win-modal']").should("not.exist");
  });

  it("restarts from the 2048 modal", () => {
    visitGame({
      board: [[1024, 1024, 0, 0], ...emptyBoard.slice(1)]
    });

    moveWithKeyboard("left");
    cy.get("[data-testid='win-modal']").should("be.visible");
    cy.contains("Restart").click();

    cy.get("[data-testid='win-modal']").should("not.exist");
    expectPlayableBoard();
    expectScore(0);
  });

  it("shows game over and restarts from the overlay", () => {
    visitGameWithAxe({
      board: [
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2]
      ],
      gameState: "lost",
      score: 128,
      bestScore: 256
    });

    cy.get("[data-testid='game-over-overlay']").should("be.visible");
    cy.contains("Game over").should("be.visible");
    expectScore(128);
    expectBestScore(256);
    checkCriticalAndSeriousA11y("[data-testid='game-over-overlay']");

    cy.contains("Try again").click();

    cy.get("[data-testid='game-over-overlay']").should("not.exist");
    expectPlayableBoard();
    expectScore(0);
    expectBestScore(256);
  });

  it("restarts from the header control", () => {
    visitGameWithAxe({
      board: [[2, 2, 0, 0], ...emptyBoard.slice(1)]
    });

    moveWithKeyboard("left");
    cy.get("[aria-label='Start a new game']").click();

    expectPlayableBoard();
    expectScore(0);
  });

  it("hides arrow controls on touch phones and tablets", () => {
    cy.viewport("iphone-x");
    visitGame(undefined, 5);
    cy.get(arrowControlSelector).should("not.exist");

    cy.viewport("ipad-2");
    visitGame(undefined, 5);
    cy.get(arrowControlSelector).should("not.exist");
  });
});
