import Link from 'next/link'

type Props = {
  games: any[]
  bets: any[]
  profiles: any[]
  teams: any[]
  perfil: any
}

export default function PalpitesPreview({
  games,
  bets,
  profiles,
  teams,
  perfil
}: Props) {

  const proximoJogo =
    games
      .filter(
        (game) =>
          new Date(
            game.match_date
          ) > new Date()
      )
      .sort(
        (a, b) =>
          new Date(
            a.match_date
          ).getTime() -
          new Date(
            b.match_date
          ).getTime()
      )[0]

  if (!proximoJogo) {
    return null
  }

  const jogoLiberado =
    new Date(
      proximoJogo.match_date
    ) <= new Date()

  const homeTeam =
    teams.find(
      (t) =>
        t.nome ===
        proximoJogo.home_team
    )

  const awayTeam =
    teams.find(
      (t) =>
        t.nome ===
        proximoJogo.away_team
    )

  const betsDoJogo =
    bets.filter(
      (bet) =>
        bet.game_id ===
        proximoJogo.id
    )

  const meuPalpite =
    betsDoJogo.find(
      (bet) =>
        bet.user_id ===
        perfil?.id
    )

  const outrosPalpites =
    betsDoJogo.filter(
      (bet) =>
        bet.user_id !==
        perfil?.id
    )

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
          Próximo jogo
        </p>

        <Link
          href="/palpites-publicos"
          className="
            text-4xl
            font-semibold
            tracking-tight
            hover:text-white/80
            transition
            inline-block
          "
        >
          Palpites dos Adversários
        </Link>

      </div>

      {/* CARD */}

      <div
        className="
          bg-zinc-900/10
          rounded-[16px]
          p-8
        "
      >

        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-center
            gap-3
          "
        >

          {/* HOME */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <img
              src={`https://flagcdn.com/w320/${homeTeam?.flag}.png`}
              className="
                w-8
                h-6
                object-cover
                rounded
              "
            />

            <p
              className="
                w-[35px]
                text-right
                text-lg
                font-bold
              "
            >
              {proximoJogo.home_team}
            </p>

          </div>

          {/* PLACAR */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <div
              className="
                w-10
                h-10
                bg-zinc-800
                rounded-[8px]
              "
            />

            <span
              className="
                text-white/60
                text-xs
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
              "
            />

          </div>

          {/* AWAY */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <p
              className="
                w-[35px]
                text-left
                text-lg
                font-bold
              "
            >
              {proximoJogo.away_team}
            </p>

            <img
              src={`https://flagcdn.com/w320/${awayTeam?.flag}.png`}
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
            text-center
            text-white/40
            text-xs
            mt-4
          "
        >
          {new Date(
            proximoJogo.match_date
          ).toLocaleString(
            'pt-BR',
            {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            }
          )}
        </p>
        <br></br>

        {/* MEU PALPITE */}

        {meuPalpite && (

          <div
            className="
              mt-6
              flex
              flex-col
              items-center
            "
          >

            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.2em]
                text-white/40
                mb-2
              "
            >
              MEU PALPITE
            </p>

            <div
              className="
                flex
                items-center
                gap-2
              "
            >

              <div
                className="
                  w-8
                  h-8
                  bg-zinc-800
                  rounded-[6px]
                  flex
                  items-center
                  justify-center
                  text-x
                  font-bold
                "
              >
                {
                  jogoLiberado
                    ? meuPalpite.home_guess
                    : ''
                }
              </div>

              <span
                className="
                  text-white/50
                  text-xs
                "
              >
                x
              </span>

              <div
                className="
                  w-8
                  h-8
                  bg-zinc-800
                  rounded-[6px]
                  flex
                  items-center
                  justify-center
                  text-xs
                  font-bold
                "
              >
                {
                  jogoLiberado
                    ? meuPalpite.away_guess
                    : ''
                }
              </div>

            </div>

          </div>

        )}

        {/* LINHA */}
        <br></br>

        <div
          className="
            w-full
            h-px
            bg-white/
            my-6
          "
        />

        {/* PALPITES */}

        <div
          className="
            flex
            flex-col
            gap-5
          "
        >

          {outrosPalpites
            .slice(0, 3)
            .map((bet) => {

            const profile =
              profiles.find(
                (p) =>
                  p.id ===
                  bet.user_id
              )

            return (

              <div
                key={bet.id}
                className="
                  flex
                  flex-col
                  items-center
                "
              >

                <p
                  className="
                    text-sm
                    font-semibold
                    uppercase
                    mb-2
                  "
                >
                  {profile?.nome}
                </p>

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >

                  <div
                    className="
                      w-9
                      h-9
                      bg-zinc-800
                      rounded-[8px]
                      flex
                      items-center
                      justify-center
                      text-sm
                      font-bold
                    "
                  >
                    {
                      jogoLiberado
                        ? bet.home_guess
                        : ''
                    }
                  </div>

                  <span
                    className="
                      text-white/60
                      text-xs
                    "
                  >
                    x
                  </span>

                  <div
                    className="
                      w-9
                      h-9
                      bg-zinc-800
                      rounded-[8px]
                      flex
                      items-center
                      justify-center
                      text-sm
                      font-bold
                    "
                  >
                    {
                      jogoLiberado
                        ? bet.away_guess
                        : ''
                    }
                  </div>

                </div>

              </div>

            )

          })}

        </div>

      </div>

      {/* BOTÃO */}

      <div className="flex justify-center mt-6">

        <Link
          href="/palpites-publicos"
          className="
            border
            border-white/10
            bg-white/5
            hover:bg-white/10
            transition
            px-20
            py-20
            rounded-[8px]
            text-x
            font-medium
            backdrop-blur-sm
          "
        >
          VER TODOS OS PALPITES
        </Link>

      </div>
<br></br>
    </section>

  )

}