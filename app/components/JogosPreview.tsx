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

      {/* TÍTULO */}


      <div className="mb-8 text-center">

<br></br><br></br><br></br>

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

        {games.slice(0, 3).map((game) => {

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

          return (

            <section
              key={game.id}
              className="
                bg-zinc-900/10
                rounded-[10px]
                p-6
              "
            >

              {/* GRUPO */}

              <p
                className="
                  text-sm
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
    gap-8
  "
>

                {/* HOME */}

                <div
  className="
    w-[220px]
    flex
    items-center
    justify-end
    gap-4
  "
>

                  <img
                    src={`https://flagcdn.com/w320/${homeTeam?.flag}.png`}
                    alt=""
                    className="
                      w-14
                      h-10
                      object-cover
                      rounded-md
                      shadow-lg
                    "
                  />

                  <p
  className="
    w-[70px]
    text-right
    text-3xl
    font-bold
    tracking-wide
  "
>
                    {game.home_team}
                  </p>

                </div>

                {/* INPUT HOME */}

                <input
                  type="number"
                  placeholder="0"
                  className="
                    w-14
                    h-14
                    bg-zinc-800
                    rounded-[10px]
                    text-center
                    text-2xl
                    font-bold
                  "
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

                {/* VS */}

                <span
                  className="
                    text-white/70
                    text-lg
                    uppercase
                    font-semibold
                  "
                >
                  vs
                </span>

                {/* INPUT AWAY */}

                <input
                  type="number"
                  placeholder="0"
                  className="
                    w-14
                    h-14
                    bg-zinc-800
                    rounded-[10px]
                    text-center
                    text-2xl
                    font-bold
                  "
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

                {/* AWAY */}

                <div
  className="
    w-[220px]
    flex
    items-center
    justify-start
    gap-4
  "
>

                 <p
  className="
    w-[70px]
    text-left
    text-3xl
    font-bold
    tracking-wide
  "
>
                    {game.away_team}
                  </p>

                  <img
                    src={`https://flagcdn.com/w320/${awayTeam?.flag}.png`}
                    alt=""
                    className="
                      w-14
                      h-10
                      object-cover
                      rounded-md
                      shadow-lg
                    "
                  />

                </div>

              </div>

              {/* DATA */}

              <p
                className="
                  text-white/70
                  text-center
                  mt-5
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
            px-20
            py-10
            rounded-[8px]
            text-sm
            font-medium
            backdrop-blur-sm
          "
        >
          Ver todos os meus palpites
        </Link>

      </div>

    </section>

  )

}