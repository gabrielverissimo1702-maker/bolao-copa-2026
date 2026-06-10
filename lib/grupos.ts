export const DIVULGACAO_GRUPOS =
  new Date(
    '2026-06-11T16:00:00-03:00'
  ).getTime()

export const PONTOS_POR_POSICAO = 5

export const ORDEM_GRUPOS = [
  'A', 'B', 'C', 'D',
  'E', 'F', 'G', 'H',
  'I', 'J', 'K', 'L'
]

export const POSICOES_GRUPO = [
  'first_place',
  'second_place',
  'third_place',
  'fourth_place'
] as const

type GroupRecord = {
  group_name?: string
  first_place?: string
  second_place?: string
  third_place?: string
  fourth_place?: string
}

export function calcularPontosGrupo(
  prediction?: GroupRecord | null,
  result?: GroupRecord | null
) {

  if (
    !prediction ||
    !result
  ) {
    return 0
  }

  const acertos =
    POSICOES_GRUPO.filter(
      (posicao) =>
        prediction[posicao] &&
        prediction[posicao] ===
          result[posicao]
    ).length

  return acertos * PONTOS_POR_POSICAO

}

export function calcularTotalPontosGrupos(
  userId: string,
  predictions: GroupRecord[],
  resultsByGroup: Record<string, GroupRecord>
) {

  return predictions
    .filter(
      (prediction: any) =>
        prediction.user_id === userId
    )
    .reduce(
      (total, prediction) =>
        total +
        calcularPontosGrupo(
          prediction,
          prediction.group_name
            ? resultsByGroup[
              prediction.group_name
            ]
            : null
        ),
      0
    )

}
