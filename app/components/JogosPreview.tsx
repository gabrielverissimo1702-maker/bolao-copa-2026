import Link from 'next/link'

type Props = {
  games: any[]
  teams: any[]
  palpites: any
  handleChange: any
}

export default function JogosPreview({
  games,
  teams,
  palpites,
  handleChange
}: Props) {

  return (

    <section>

      <br></br>
      <br></br>
      <br></br>

      {/* TÍTULO */}

      <div className="mb-8 text-center">

        <p
          className="
            text-white/70
            uppercase
            tracking-[0.3em]
            text-xs
            mb-3
          "
        >
          Copa do Mundo 2026
        </p>

        <Link
          href="/jogos"
          className="
            text-4xl
            font-semibold
            tracking-tight
            hover:text-white/80
            transition
            inline-block
          "
        >
          Meus Palpites
        </Link>

      </div>

      {/* JOGOS */}

      <div
        className="
          flex
          flex-col
          gap-6
        "
      >

        {games.slice(0, 4).map((game) => {

          const homeTeam =
            teams.find(
              (t) =>
                t.nome === game.home_team
            )

          const awayTeam =
            teams.find(
              (t) =>
                t.nome === game.away_team
            )

          const bloqueado =
            new Date(
              game.match_date
            ) <= new Date()

          return (

            <section
              key={game.id}
              className="
                bg-zinc-900/10
                rounded-[10px]
                p-5
              "
            >

              {/* GRUPO */}

              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.3em]
                  text-white/70
                  mb-5
                  text-center
                "
              >
                {game.group_name}
                {' • '}
                {game.round}ª Rodada
              </p>

              {/* LINHA JOGO */}

              <div
                className="
                  w-full
                  flex
                  items-center
                  justify-center
                  gap-3
                "
              >

                {/* HOME */}

                <div
                  className="
                    w-[95px]
                    flex
                    items-center
                    justify-end
                    gap-2
                  "
                >

                  <img
                    src={`https://flagcdn.com/w320/${homeTeam?.flag}.png`}
                    alt=""
                    className="
                      w-8
                      h-6
                      object-cover
                      rounded
                    "
                  />

                  <p
                    className="
                      w-[40px]
                      text-right
                      text-lg
                      font-bold
                    "
                  >
                    {game.home_team}
                  </p>

                </div>

                {/* INPUT HOME */}

    <div
  className="
    w-10
    h-10
    bg-zinc-800
    rounded-[8px]
    flex
    items-center
    justify-center
    text-sm
    font-bold
    opacity-80
  "
>
  {
    palpites[game.id]?.home ?? ''
  }
</div>

<span
  className="
    text-white/60
    text-xs
    uppercase
    font-semibold
  "
>
  x
</span>

<div
  className="
    w-10
    h-10
    bg-zinc-800
    rounded-[8px]
    flex
    items-center
    justify-center
    text-sm
    font-bold
    opacity-80
  "
>
  {
    palpites[game.id]?.away ?? ''
  }
</div>

                {/* AWAY */}

                <div
                  className="
                    w-[95px]
                    flex
                    items-center
                    justify-start
                    gap-2
                  "
                >

                  <p
                    className="
                      w-[40px]
                      text-left
                      text-lg
                      font-bold
                    "
                  >
                    {game.away_team}
                  </p>

                  <img
                    src={`https://flagcdn.com/w320/${awayTeam?.flag}.png`}
                    alt=""
                    className="
                      w-8
                      h-6
                      object-cover
                      rounded
                    "
                  />

                </div>

              </div>

              {/* DATA */}

              <p
                className="
                  text-white/50
                  text-center
                  mt-5
                  text-xs
                "
              >
                {new Date(
                  game.match_date
                ).toLocaleString(
                  'pt-BR',
                  {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }
                )}
              </p>

            </section>

          )

        })}

      </div>

      {/* VER MAIS */}

      <div className="flex justify-center mt-6">

        <Link
          href="/jogos"
          className="
            border
            border-white/10
            bg-white/5
            hover:bg-white/10
            transition
            px-10
            py-6
            rounded-[8px]
            text-x
            font-medium
            backdrop-blur-sm
          "
        >
          VER TODOS OS MEUS PALPITES
        </Link>

      </div>
<br></br>
    </section>

  )

}