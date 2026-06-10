type GameRecord = {
  id?: number
  home_score?: number | null
  away_score?: number | null
}

type BetRecord = {
  user_id?: string
  game_id?: number
  home_guess?: number | null
  away_guess?: number | null
}

export function isCravada(
  bet?: BetRecord | null,
  game?: GameRecord | null
) {

  if (
    !bet ||
    !game ||
    game.home_score === null ||
    game.home_score === undefined ||
    game.away_score === null ||
    game.away_score === undefined
  ) {
    return false
  }

  return (
    Number(bet.home_guess) ===
      Number(game.home_score) &&
    Number(bet.away_guess) ===
      Number(game.away_score)
  )

}

export function calcularCravadasUsuario(
  userId: string,
  bets: BetRecord[],
  gamesById: Record<number, GameRecord>
) {

  return bets.filter(
    (bet) =>
      bet.user_id === userId &&
      isCravada(
        bet,
        bet.game_id
          ? gamesById[bet.game_id]
          : null
      )
  ).length

}
