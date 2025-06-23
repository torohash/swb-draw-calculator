import { z } from "zod";
import { MulliganType } from "../types/drawTable";

export const probabilityFormSchema = z
  .object({
    targetCards: z
      .number()
      .int("整数を入力してください")
      .min(1, "ターゲットカード枚数は1以上で入力してください")
      .max(40, "ターゲットカード枚数は40以下で入力してください"),
    minTarget: z
      .number()
      .int("整数を入力してください")
      .min(1, "最小ターゲット数は1以上で入力してください"),
    mulliganType: z.nativeEnum(MulliganType),
  })
  .refine((data) => data.minTarget <= data.targetCards, {
    message: "最小ターゲット数はターゲットカード枚数以下で入力してください",
    path: ["minTarget"],
  });

export type ProbabilityFormData = z.infer<typeof probabilityFormSchema>;
