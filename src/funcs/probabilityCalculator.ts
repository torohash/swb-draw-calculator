import { MulliganType } from "../types/drawTable";
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
  mulliganType: MulliganType = MulliganType.WITHOUT_REPLACEMENT,
): number => {
  if (exchangeCount === 0) {
    return calculateInitialHandProbability(deckSize, targetCards, 4, minTarget);
  }

  // 最適なマリガン戦略を仮定：
  // - 目的のカードが minTarget 枚以上ある場合は交換しない
  // - 目的のカードが minTarget 枚未満の場合は、目的でないカードを交換

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

    // すでに必要枚数を引いている場合
    if (initialTargets >= minTarget) {
      totalProbability += initialProb;
      continue;
    }

    // 交換戦略: 目的でないカードを優先的に交換
    const nonTargetsInHand = initialHandSize - initialTargets;
    const actualExchangeCount = Math.min(exchangeCount, nonTargetsInHand);

    if (actualExchangeCount === 0) {
      // 交換できない（すべて目的のカード）
      totalProbability += initialProb * (initialTargets >= minTarget ? 1 : 0);
      continue;
    }

    // 交換後の計算
    const keptTargets = initialTargets; // 目的のカードはキープ
    const newDeckSize =
      mulliganType === MulliganType.WITH_REPLACEMENT
        ? deckSize
        : deckSize - initialHandSize;
    const newTargetCards = targetCards - initialTargets;
    const newDraws = actualExchangeCount;

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
  mulliganType: MulliganType = MulliganType.WITHOUT_REPLACEMENT,
): number => {
  // For turn 0, use mulligan probability
  if (turn === 0) {
    return calculateMulliganProbability(
      deckSize,
      targetCards,
      mulliganPattern,
      minTarget,
      mulliganType,
    );
  }

  // For turns > 0, we need to consider mulligan results
  let totalProbability = 0;

  // Consider all possible outcomes after mulligan
  for (
    let targetsAfterMulligan = 0;
    targetsAfterMulligan <= Math.min(targetCards, 4);
    targetsAfterMulligan++
  ) {
    // Probability of having exactly targetsAfterMulligan after mulligan
    const probAfterMulligan = calculateExactTargetsAfterMulligan(
      deckSize,
      targetCards,
      mulliganPattern,
      targetsAfterMulligan,
      mulliganType,
    );

    if (probAfterMulligan === 0) continue;

    // If we already have enough targets, probability is 1
    if (targetsAfterMulligan >= minTarget) {
      totalProbability += probAfterMulligan;
    } else {
      // Calculate probability of drawing the remaining needed targets
      const remainingDeck = deckSize - 4;
      const remainingTargets = targetCards - targetsAfterMulligan;
      const additionalDraws = turn;
      const neededTargets = minTarget - targetsAfterMulligan;

      // Probability of drawing at least neededTargets in additionalDraws
      const probDrawNeeded = cumulativeProbability(
        remainingDeck,
        remainingTargets,
        additionalDraws,
        neededTargets,
      );

      totalProbability += probAfterMulligan * probDrawNeeded;
    }
  }

  return totalProbability;
};

const calculateExactTargetsAfterMulligan = (
  deckSize: number,
  targetCards: number,
  exchangeCount: number,
  exactTargets: number,
  mulliganType: MulliganType = MulliganType.WITHOUT_REPLACEMENT,
): number => {
  if (exchangeCount === 0) {
    // No mulligan, just initial hand probability
    return hypergeometricProbability(deckSize, targetCards, 4, exactTargets);
  }

  let totalProbability = 0;
  const initialHandSize = 4;

  // Consider all possible initial hand compositions
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

    // Optimal mulligan strategy
    const nonTargetsInHand = initialHandSize - initialTargets;
    const actualExchangeCount = Math.min(exchangeCount, nonTargetsInHand);

    if (actualExchangeCount === 0) {
      // No cards to exchange, final count is initial count
      if (initialTargets === exactTargets) {
        totalProbability += initialProb;
      }
      continue;
    }

    // Calculate probability of ending with exactly exactTargets
    const keptTargets = initialTargets;
    const newDeckSize =
      mulliganType === MulliganType.WITH_REPLACEMENT
        ? deckSize
        : deckSize - initialHandSize;
    const newTargetCards = targetCards - initialTargets;
    const newDraws = actualExchangeCount;
    const neededNewTargets = exactTargets - keptTargets;

    if (neededNewTargets < 0 || neededNewTargets > newDraws) {
      continue; // Impossible to achieve exactTargets
    }

    const probNewTargets = hypergeometricProbability(
      newDeckSize,
      newTargetCards,
      newDraws,
      neededNewTargets,
    );

    totalProbability += initialProb * probNewTargets;
  }

  return totalProbability;
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
  mulliganType: MulliganType = MulliganType.WITHOUT_REPLACEMENT,
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
          mulliganType,
        ) * 100,
      exchange1:
        calculateDrawProbabilityAtTurn(
          deckSize,
          targetCards,
          turn,
          1,
          minTarget,
          mulliganType,
        ) * 100,
      exchange2:
        calculateDrawProbabilityAtTurn(
          deckSize,
          targetCards,
          turn,
          2,
          minTarget,
          mulliganType,
        ) * 100,
      exchange3:
        calculateDrawProbabilityAtTurn(
          deckSize,
          targetCards,
          turn,
          3,
          minTarget,
          mulliganType,
        ) * 100,
      exchange4:
        calculateDrawProbabilityAtTurn(
          deckSize,
          targetCards,
          turn,
          4,
          minTarget,
          mulliganType,
        ) * 100,
    };
    results.push(result);
  }

  return results;
};
