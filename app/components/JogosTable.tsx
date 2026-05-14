type Props = {
  games: any[]
  palpites: any
  handleChange: any
}

export default function JogosTable({
  games,
  palpites,
  handleChange
}: Props) {

  return (

    <div>

      {games.map((game) => (

        <div
          key={game.id}
          className="bg-zinc-800 p-5 rounded-2xl mb-5 shadow-lg"
        >

          <p className="text-xl font-bold mb-2">
            {game.home_team}
            {' x '}
            {game.away_team}
          </p>

          <p className="text-zinc-400 mb-4">
            Resultado:
            {' '}
            {game.home_score}
            {' x '}
            {game.away_score}
          </p>

          <div className="flex items-center gap-2">

            <input
              type="number"
              placeholder="Casa"
              className="w-16 p-2 rounded-lg bg-zinc-700 text-white text-center"
              value={
                palpites[game.id]?.home ?? ''
              }
              onChange={(e) =>
                handleChange(
                  game.id,
                  'home',
                  e.target.value
                )
              }
            />

            <span>x</span>

            <input
              type="number"
              placeholder="Fora"
              className="w-16 p-2 rounded-lg bg-zinc-700 text-white text-center"
              value={
                palpites[game.id]?.away ?? ''
              }
              onChange={(e) =>
                handleChange(
                  game.id,
                  'away',
                  e.target.value
                )
              }
            />

          </div>

        </div>

      ))}

    </div>

  )

}