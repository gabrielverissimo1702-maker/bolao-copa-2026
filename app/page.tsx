'use client'

import { useEffect, useState } from 'react'

import { supabase } from '../lib/supabase'

import Navbar from './components/Navbar'
import RankingPreview from './components/RankingPreview'
import JogosPreview from './components/JogosPreview'
import PalpitesPreview from './components/PalpitesPreview'

export default function Home() {

  const [perfil, setPerfil] =
    useState<any>(null)

  const [games, setGames] =
    useState<any[]>([])

  const [teams, setTeams] =
    useState<any[]>([])

  const [ranking, setRanking] =
    useState<any[]>([])

  const [palpites, setPalpites] =
    useState<any>({})

  const [ultimaCravada, setUltimaCravada] =
    useState<any>(null)

  const [allBets, setAllBets] =
    useState<any[]>([])

  const [profiles, setProfiles] =
    useState<any[]>([])

  const [carregando, setCarregando] =
    useState(true)

  useEffect(() => {

    const carregar = async () => {

      const { data } =
        await supabase.auth.getUser()

      if (!data.user) {

        window.location.href =
          '/login'

        return

      }

      const user = data.user

      setCarregando(false)

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

      /* BETS USER */

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

      /* TODAS BETS */

      const { data: allBetsData } =
        await supabase
          .from('bets')
          .select('*')

      if (allBetsData) {
        setAllBets(allBetsData)
      }

      /* PROFILES */

      const { data: profilesData } =
        await supabase
          .from('profiles')
          .select('*')

      if (profilesData) {
        setProfiles(profilesData)
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

      if (
        profilesData &&
        allBetsData &&
        gamesData
      ) {

        const rankingCalculado =
          profilesData.map((profile) => {

            let total = 0

            let cravadas = 0

            allBetsData.forEach((bet) => {

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

  if (carregando) {

    return (

      <main
        className="
          min-h-screen
          flex
          items-center
          justify-center
        "
      >

        <p
          className="
            text-2xl
            text-white/70
          "
        >
          Carregando...
        </p>

      </main>

    )

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

      {/* BLOCO PRINCIPAL */}

      <div
        className="
          w-full
          flex
          justify-center
          px-6
        "
      >

        <div
          className="
            w-full
            max-w-7xl
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-16
            items-start
          "
        >

          {/* MEUS PALPITES */}

          <JogosPreview
            games={games}
            teams={teams}
            palpites={palpites}
            handleChange={handleChange}
          />
          {/* PALPITES ADVERSÁRIOS */}

          <PalpitesPreview
            games={games}
            bets={allBets}
            profiles={profiles}
            teams={teams}
            perfil={perfil}
          />

        </div>

      </div>

      {/* PERFORMANCE */}

      <div
        className="
          w-full
          flex
          justify-center
          px-6
          mt-32
        "
      >

        <div
          className="
            w-full
            max-w-7xl
            grid
            grid-cols-1
            xl:grid-cols-2
            gap-16
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
                PERFORMANCE
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

                {/* POSIÇÃO */}

                <div
                  className="
                    w-40
                    h-28
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
      THE BEST
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
      p-8
    "
  >

    {ultimaCravada ? (

      <div
        className="
          flex
          flex-col
          items-center
          gap-5
        "
      >

        {/* JOGO */}

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
              src={`https://flagcdn.com/w320/${
                teams.find(
                  (t) =>
                    t.nome ===
                    ultimaCravada.home_team
                )?.flag
              }.png`}
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
              {ultimaCravada.home_team}
            </p>

          </div>

          {/* RESULTADO */}

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
                flex
                items-center
                justify-center
                text-sm
                font-bold
              "
            >
              {ultimaCravada.home_score}
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
              "
            >
              {ultimaCravada.away_score}
            </div>

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
            text-xs
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

      </div>

      {/* CLASSIFICAÇÃO */}

      <div
        className="
          w-full
          flex
          justify-center
          px-6
          mt-32
        "
      >

        <div
          className="
            w-full
            max-w-7xl
          "
        >

          <RankingPreview
            ranking={ranking}
          />

        </div>

      </div>

      {/* SAIR */}

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

            window.location.href =
              '/login'

          }}
          className="
            border
            border-white/10
            bg-white/20
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