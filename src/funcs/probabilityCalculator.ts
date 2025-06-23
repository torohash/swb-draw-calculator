import {
  cumulativeProbability,
  hypergeometricProbability,
} from "./hypergeometric";

export const calculateInitialHandProbability = (
  deckSize: number,
  targetCards: number,
  handSize: number,
  minTarget: number,
): number => {
  // Input validation
  if (deckSize < 0 || targetCards < 0 || handSize < 0 || minTarget < 0) {
    throw new Error("All parameters must be non-negative");
  }
  if (targetCards > deckSize) {
    throw new Error("Target cards cannot exceed deck size");
  }
  if (handSize > deckSize) {
    throw new Error("Hand size cannot exceed deck size");
  }
  if (minTarget > targetCards) {
    return 0; // Impossible to draw more targets than exist in deck
  }
  if (minTarget > handSize) {
    return 0; // Impossible to draw more cards than hand size
  }

  return cumulativeProbability(deckSize, targetCards, handSize, minTarget);
};

export const calculateMulliganProbability = (
  deckSize: number,
  targetCards: number,
  exchangeCount: number,
  minTarget: number,
): number => {
  if (exchangeCount === 0) {
    return calculateInitialHandProbability(deckSize, targetCards, 4, minTarget);
  }

  let totalProbability = 0;
  const initialHandSize = 4;

  for (
    let initialTargets = 0;
    initialTargets <= Math.min(targetCards, initialHandSize);
    initialTargets++
  ) {
    const initialProb = hypergeometricProbability(
      deckSize,
      targetCards,
      initialHandSize,
      initialTargets,
    );

    if (initialProb === 0) continue;

    const kept = initialHandSize - exchangeCount;
    const keptTargets = Math.min(initialTargets, kept);

    const newDeckSize = deckSize - kept;
    const newTargetCards = targetCards - keptTargets;
    const newDraws = exchangeCount;

    let probAfterMulligan = 0;

    for (
      let newTargets = Math.max(0, minTarget - keptTargets);
      newTargets <= Math.min(newTargetCards, newDraws);
      newTargets++
    ) {
      probAfterMulligan += hypergeometricProbability(
        newDeckSize,
        newTargetCards,
        newDraws,
        newTargets,
      );
    }

    totalProbability += initialProb * probAfterMulligan;
  }

  return totalProbability;
};

export const calculateDrawProbabilityAtTurn = (
  deckSize: number,
  targetCards: number,
  turn: number,
  mulliganPattern: number,
  minTarget: number,
): number => {
  if (turn === 0) {
    return calculateMulliganProbability(
      deckSize,
      targetCards,
      mulliganPattern,
      minTarget,
    );
  }

  let cumulativeProb = 0;

  for (let foundBefore = 0; foundBefore < minTarget; foundBefore++) {
    const probFoundBefore = calculateExactlyKAtTurn(
      deckSize,
      targetCards,
      turn - 1,
      mulliganPattern,
      foundBefore,
    );

    if (probFoundBefore === 0) continue;

    const remainingDeck = deckSize - 4 - (turn - 1);
    const remainingTargets = targetCards - foundBefore;
    const needed = minTarget - foundBefore;

    const probDrawNeeded =
      remainingTargets >= needed && remainingDeck > 0
        ? remainingTargets / remainingDeck
        : 0;

    cumulativeProb += probFoundBefore * probDrawNeeded;
  }

  cumulativeProb += calculateDrawProbabilityAtTurn(
    deckSize,
    targetCards,
    turn - 1,
    mulliganPattern,
    minTarget,
  );

  return cumulativeProb;
};

const calculateExactlyKAtTurn = (
  deckSize: number,
  targetCards: number,
  turn: number,
  mulliganPattern: number,
  exactK: number,
): number => {
  if (turn === 0) {
    return (
      hypergeometricProbability(deckSize, targetCards, 4, exactK) *
      (mulliganPattern === 0 ? 1 : 0)
    );
  }

  return 0;
};

export interface DrawProbabilityResult {
  none: number;
  exchange1: number;
  exchange2: number;
  exchange3: number;
  exchange4: number;
}

export const calculateDrawProbability = (
  deckSize: number,
  targetCards: number,
  from: number,
  to: number,
  minTarget: number,
): DrawProbabilityResult[] => {
  const results: DrawProbabilityResult[] = [];

  for (let turn = from; turn <= to; turn++) {
    const result: DrawProbabilityResult = {
      none:
        calculateDrawProbabilityAtTurn(
          deckSize,
          targetCards,
          turn,
          0,
          minTarget,
        ) * 100,
      exchange1:
        calculateDrawProbabilityAtTurn(
          deckSize,
          targetCards,
          turn,
          1,
          minTarget,
        ) * 100,
      exchange2:
        calculateDrawProbabilityAtTurn(
          deckSize,
          targetCards,
          turn,
          2,
          minTarget,
        ) * 100,
      exchange3:
        calculateDrawProbabilityAtTurn(
          deckSize,
          targetCards,
          turn,
          3,
          minTarget,
        ) * 100,
      exchange4:
        calculateDrawProbabilityAtTurn(
          deckSize,
          targetCards,
          turn,
          4,
          minTarget,
        ) * 100,
    };
    results.push(result);
  }

  return results;
};
