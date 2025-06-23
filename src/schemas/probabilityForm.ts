import { z } from "zod";
import { MulliganType } from "../types/drawTable";

export const probabilityFormSchema = z
  .object({
    deckSize: z
      .number()
      .int("整数を入力してください")
      .min(1, "デッキサイズは1以上で入力してください")
      .max(100, "デッキサイズは100以下で入力してください"),
    targetCards: z
      .number()
      .int("整数を入力してください")
      .min(1, "ターゲットカード枚数は1以上で入力してください"),
    fromTurn: z
      .number()
      .int("整数を入力してください")
      .min(1, "開始ターンは1以上で入力してください")
      .max(100, "開始ターンは100以下で入力してください"),
    toTurn: z
      .number()
      .int("整数を入力してください")
      .min(1, "終了ターンは1以上で入力してください")
      .max(100, "終了ターンは100以下で入力してください"),
    minTarget: z
      .number()
      .int("整数を入力してください")
      .min(1, "最小ターゲット数は1以上で入力してください"),
    mulliganType: z.nativeEnum(MulliganType),
  })
  .refine((data) => data.targetCards <= data.deckSize, {
    message: "ターゲットカード枚数はデッキサイズ以下で入力してください",
    path: ["targetCards"],
  })
  .refine((data) => data.toTurn >= data.fromTurn, {
    message: "終了ターンは開始ターン以上で入力してください",
    path: ["toTurn"],
  })
  .refine((data) => data.minTarget <= data.targetCards, {
    message: "最小ターゲット数はターゲットカード枚数以下で入力してください",
    path: ["minTarget"],
  });

export type ProbabilityFormData = z.infer<typeof probabilityFormSchema>;
