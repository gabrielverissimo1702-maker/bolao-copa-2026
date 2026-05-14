'use client'

import { useEffect, useState } from 'react'

import { supabase } from '../lib/supabase'

import Navbar from './components/Navbar'
import RankingPreview from './components/RankingPreview'
import JogosPreview from './components/JogosPreview'

export default function Home() {

  const [perfil, setPerfil] = useState<any>(null)

  const [games, setGames] = useState<any[]>([])

  const [teams, setTeams] = useState<any[]>([])

  const [ranking, setRanking] = useState<any[]>([])

  const [palpites, setPalpites] = useState<any>({})

  const [ultimaCravada, setUltimaCravada] =
    useState<any>(null)

  useEffect(() => {

    const carregar = async () => {

      const { data } =
        await supabase.auth.getUser()

      if (!data.user) return

      const user = data.user

      if (!user) {

  window.location.href = '/'

  return

}

      /* PERFIL */

      const { data: meuPerfil } =
        await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

      if (meuPerfil) {
        setPerfil(meuPerfil)
      }

      /* GAMES */

      const { data: gamesData } =
        await supabase
          .from('games')
          .select('*')

      if (gamesData) {
        setGames(gamesData)
      }

      /* TEAMS */

      const { data: teamsData } =
        await supabase
          .from('teams')
          .select('*')

      if (teamsData) {
        setTeams(teamsData)
      }

      /* BETS */

      const { data: betsData } =
        await supabase
          .from('bets')
          .select('*')
          .eq('user_id', user.id)

      if (betsData) {

        const formatado: any = {}

        betsData.forEach((bet) => {

          formatado[bet.game_id] = {
            home: bet.home_guess,
            away: bet.away_guess
          }

        })

        setPalpites(formatado)

      }

      /* ÚLTIMA CRAVADA */

      if (
        betsData &&
        gamesData
      ) {

        const cravadas =
          betsData.filter((bet) => {

            const jogo =
              gamesData.find(
                (g) => g.id === bet.game_id
              )

            if (!jogo) return false

            return (
              jogo.home_score ===
                bet.home_guess &&
              jogo.away_score ===
                bet.away_guess
            )

          })

        if (cravadas.length > 0) {

          const ultima =
            cravadas[
              cravadas.length - 1
            ]

          const jogo =
            gamesData.find(
              (g) =>
                g.id === ultima.game_id
            )

          if (jogo) {
            setUltimaCravada(jogo)
          }

        }

      }

      /* RANKING */

      const { data: profilesData } =
        await supabase
          .from('profiles')
          .select('*')

      const { data: allBets } =
        await supabase
          .from('bets')
          .select('*')

      if (
        profilesData &&
        allBets &&
        gamesData
      ) {

        const rankingCalculado =
          profilesData.map((profile) => {

            let total = 0

            let cravadas = 0

            allBets.forEach((bet) => {

              if (
                bet.user_id !== profile.id
              ) {
                return
              }

              const jogo =
                gamesData.find(
                  (g) =>
                    g.id === bet.game_id
                )

              if (!jogo) return

              if (
                jogo.home_score ===
                  bet.home_guess &&
                jogo.away_score ===
                  bet.away_guess
              ) {

                total += 5

                cravadas += 1

                return

              }

              const resultadoReal =
                jogo.home_score >
                jogo.away_score
                  ? 'casa'
                  : jogo.home_score <
                    jogo.away_score
                  ? 'fora'
                  : 'empate'

              const resultadoPalpite =
                bet.home_guess >
                bet.away_guess
                  ? 'casa'
                  : bet.home_guess <
                    bet.away_guess
                  ? 'fora'
                  : 'empate'

              if (
                resultadoReal ===
                resultadoPalpite
              ) {
                total += 2
              }

            })

            return {
              nome: profile.nome,
              pontos: total,
              cravadas
            }

          })

        rankingCalculado.sort((a, b) => {

          if (
            b.pontos !== a.pontos
          ) {
            return (
              b.pontos - a.pontos
            )
          }

          return (
            b.cravadas -
            a.cravadas
          )

        })

        setRanking(rankingCalculado)

      }

    }

    carregar()

  }, [])

  const handleChange = (
    gameId: number,
    field: string,
    value: string
  ) => {

    setPalpites({
      ...palpites,
      [gameId]: {
        ...palpites[gameId],
        [field]: value
      }
    })

  }

  return (

    <main
      className="
        min-h-screen
        py-8
      "
    >

      <Navbar
        nome={perfil?.nome || ''}
      />

      {/* TOP GRID */}

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-16
          items-start
        "
      >

        {/* CLASSIFICAÇÃO */}

        <RankingPreview
          ranking={ranking}
        />

        {/* PALPITES */}

        <JogosPreview
          games={games}
          teams={teams}
          palpites={palpites}
          handleChange={handleChange}
        />

      </div>

       {/* MINHA COLOCAÇÃO + ÚLTIMA CRAVADA */}

<div
  className="
    grid
    grid-cols-1
    xl:grid-cols-2
    gap-16
    mt-32
  "
>

  {/* MINHA COLOCAÇÃO */}

  <div>

    <div className="text-center mb-8">

      <p
        className="
          text-white/70
          uppercase
          tracking-[0.3em]
          text-xs
          mb-3
        "
      >
        SEGUE O..
      </p>

      <h2
        className="
          text-4xl
          font-semibold
          tracking-tight
        "
      >
        Minha Colocação
      </h2>

    </div>

    <div
      className="
        bg-zinc-900/10
        rounded-[10px]
        p-10
      "
    >

      <div
        className="
          flex
          items-center
          justify-center
          gap-8
        "
      >

        {/* PONTOS */}

        <div
          className="
            flex
            flex-col
            items-center
            opacity-80
          "
        >

          <span
            className="
              text-3xl
              font-bold
            "
          >
            {ranking.find(
              (r) =>
                r.nome === perfil?.nome
            )?.pontos || 0}
          </span>

          <span
            className="
              text-sm
              uppercase
              tracking-[0.2em]
              text-white/30
            "
          >
            pts
          </span>

        </div>

        {/* COLOCAÇÃO */}

        <div
          className="
            w-40
            h-28
            bg-zinc-000
            rounded-[14px]
            flex
            items-center
            justify-center
            text-6xl
            font-bold
            shadow-xl
          "
        >
          {ranking.findIndex(
            (r) =>
              r.nome === perfil?.nome
          ) + 1}
          °
        </div>

        {/* CRAVADAS */}

        <div
          className="
            flex
            flex-col
            items-center
            opacity-80
          "
        >

          <span
            className="
              text-2xl
              font-bold
            "
          >
            {ranking.find(
              (r) =>
                r.nome === perfil?.nome
            )?.cravadas || 0}
          </span>

          <span
            className="
              text-sm
              uppercase
              tracking-[0.2em]
              text-white/30
            "
          >
            cravadas
          </span>

        </div>

      </div>

    </div>

  </div>

  {/* ÚLTIMA CRAVADA */}

  <div>

    <div className="text-center mb-8">

      <p
        className="
          text-white/70
          uppercase
          tracking-[0.3em]
          text-xs
          mb-3
        "
      >
        The Best
      </p>

      <h2
        className="
          text-4xl
          font-semibold
          tracking-tight
        "
      >
        Última Cravada
      </h2>

    </div>

    <div
      className="
        bg-zinc-900/10
        rounded-[10px]
        p-10
      "
    >

      {ultimaCravada ? (

        <div
          className="
            flex
            flex-col
            items-center
            gap-6
          "
        >

          {/* TIMES */}

          <div
            className="
              flex
              items-center
              justify-center
              gap-5
              flex-wrap
            "
          >

            {/* HOME */}

            <div
              className="
                flex
                items-center
                gap-4
              "
            >

              <img
                src={`https://flagcdn.com/w320/${
                  teams.find(
                    (t) =>
                      t.nome ===
                      ultimaCravada.home_team
                  )?.flag
                }.png`}
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
                  text-3xl
                  font-bold
                  tracking-wide
                "
              >
                {ultimaCravada.home_team}
              </p>

            </div>

            {/* RESULTADO */}

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <div
                className="
                  w-14
                  h-14
                  bg-zinc-800
                  rounded-[10px]
                  flex
                  items-center
                  justify-center
                  text-2xl
                  font-bold
                "
              >
                {ultimaCravada.home_score}
              </div>

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

              <div
                className="
                  w-14
                  h-14
                  bg-zinc-800
                  rounded-[10px]
                  flex
                  items-center
                  justify-center
                  text-2xl
                  font-bold
                "
              >
                {ultimaCravada.away_score}
              </div>

            </div>

            {/* AWAY */}

            <div
              className="
                flex
                items-center
                gap-4
              "
            >

              <p
                className="
                  text-3xl
                  font-bold
                  tracking-wide
                "
              >
                {ultimaCravada.away_team}
              </p>

              <img
                src={`https://flagcdn.com/w320/${
                  teams.find(
                    (t) =>
                      t.nome ===
                      ultimaCravada.away_team
                  )?.flag
                }.png`}
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
            "
          >
            {new Date(
              ultimaCravada.match_date
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

        </div>

      ) : (

        <p
          className="
            text-center
            text-white/60
          "
        >
          Nenhuma cravada ainda
        </p>

      )}

    </div>

  </div>

</div>

      {/* SAIR */}
<br></br><br></br>

<div
        className="
          flex
          justify-center
          mt-24
          pb-20
        "
      >

        <button
            onClick={async () => {

              await supabase.auth.signOut()

              window.location.href = '/login'

            }}
          className="
            border
            border-white/10
            bg-white/5
            hover:bg-white/10
            transition
            px-16
            py-6
            rounded-[4px]
            text-xl
            font-medium
            backdrop-blur-sm
          "
          >
            SAIR
          </button>
      </div>

    </main>

  )

}