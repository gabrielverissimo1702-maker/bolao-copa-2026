'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { supabase } from '../../lib/supabase'

import Navbar from '../components/Navbar'

export default function Jogos2() {

  const [perfil, setPerfil] =
    useState<any>(null)

  const [games, setGames] =
    useState<any[]>([])

  const [teams, setTeams] =
    useState<any[]>([])

  const [palpites, setPalpites] =
    useState<any>({})

  const [allBets, setAllBets] =
    useState<any[]>([])

  const [profiles, setProfiles] =
    useState<any[]>([])

  const [pagina, setPagina] =
    useState(1)

  useEffect(() => {

    const carregar = async () => {

      const { data } =
        await supabase.auth.getUser()

      if (!data.user) return

      const user = data.user

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
          .order('match_date', {
            ascending: true
          })

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

      /* MEUS PALPITES */

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

      /* TODOS OS PALPITES */

      const { data: allBetsData } =
        await supabase
          .from('bets')
          .select('*')

      if (allBetsData) {
        setAllBets(allBetsData)
      }

      /* TODOS OS PERFIS */

      const { data: profilesData } =
        await supabase
          .from('profiles')
          .select('*')

      if (profilesData) {
        setProfiles(profilesData)
      }

    }

    carregar()

  }, [])

  /* PAGINAÇÃO */

  const jogosPorPagina = 8

  const inicio =
    (pagina - 1) *
    jogosPorPagina

  const fim =
    inicio +
    jogosPorPagina

  const jogosPaginados =
    games.slice(
      inicio,
      fim
    )

  const totalPaginas =
    Math.ceil(
      games.length /
      jogosPorPagina
    )

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

      {/* TÍTULO */}

      <div className="text-center mb-16">

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

        <h1
          className="
            text-4xl
            font-semibold
            tracking-tight
          "
        >
          Meus Palpites
        </h1>

      </div>

      {/* LISTA */}

      <div
        className="
          w-full
          flex
          justify-center
          px-4
        "
      >

        <div
          className="
            w-full
            max-w-6xl
            flex
            flex-col
            gap-8
          "
        >

          {jogosPaginados.map((game) => {

            const homeTeam =
              teams.find(
                (t) =>
                  t.nome ===
                  game.home_team
              )

            const awayTeam =
              teams.find(
                (t) =>
                  t.nome ===
                  game.away_team
              )

            const betsDoJogo =
              allBets.filter(
                (bet) =>
                  bet.game_id ===
                  game.id
              )

            return (

              <section
                key={game.id}
                className="
                  bg-zinc-900/10
                  rounded-[16px]
                  p-6
                  overflow-x-auto
                "
              >

                {/* JOGO */}

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    gap-3
                    mb-8
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
                        rounded
                        object-cover
                      "
                    />

                    <p
                      className="
                        text-lg
                        font-bold
                      "
                    >
                      {game.home_team}
                    </p>

                  </div>

                  {/* MEU PALPITE */}

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
                      {
                        palpites[game.id]?.home ?? ''
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
                      {
                        palpites[game.id]?.away ?? ''
                      }
                    </div>

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
                        text-lg
                        font-bold
                      "
                    >
                      {game.away_team}
                    </p>

                    <img
                      src={`https://flagcdn.com/w320/${awayTeam?.flag}.png`}
                      className="
                        w-8
                        h-6
                        rounded
                        object-cover
                      "
                    />

                  </div>

                </div>

                {/* TABELA */}

                <div
                  className="
                    flex
                    gap-4
                    overflow-x-auto
                    pb-2
                  "
                >

                  {/* MEU */}

                  <div
                    className="
                      min-w-[100px]
                      flex
                      flex-col
                      items-center
                      gap-3
                    "
                  >

                    <p
                      className="
                        text-[10px]
                        uppercase
                        tracking-[0.2em]
                        text-white/50
                      "
                    >
                      Meu Palpite
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
                          palpites[game.id]?.home ?? ''
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
                          palpites[game.id]?.away ?? ''
                        }
                      </div>

                    </div>

                  </div>

                  {/* OUTROS */}

                  {betsDoJogo.map((bet) => {

                    const profile =
                      profiles.find(
                        (p) =>
                          p.id ===
                          bet.user_id
                      )

                    if (
                      bet.user_id ===
                      perfil?.id
                    ) return null

                    return (

                      <div
                        key={bet.id}
                        className="
                          min-w-[90px]
                          flex
                          flex-col
                          items-center
                          gap-3
                        "
                      >

                        <p
                          className="
                            text-[10px]
                            uppercase
                            tracking-[0.2em]
                            text-white/50
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
                            {bet.home_guess}
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
                            {bet.away_guess}
                          </div>

                        </div>

                      </div>

                    )

                  })}

                </div>

              </section>

            )

          })}

        </div>

      </div>

    </main>

  )

}