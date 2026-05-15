'use client'

import { useEffect, useState } from 'react'

import Navbar from '../components/Navbar'

import { supabase } from '../../lib/supabase'

export default function PalpitesPublicos() {

  const [games, setGames] =
    useState<any[]>([])

  const [bets, setBets] =
    useState<any[]>([])

  const [profiles, setProfiles] =
    useState<any[]>([])

  const [teams, setTeams] =
    useState<any[]>([])

  useEffect(() => {

    carregar()

  }, [])

  const carregar = async () => {

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

    /* BETS */

    const { data: betsData } =
      await supabase
        .from('bets')
        .select('*')

    if (betsData) {
      setBets(betsData)
    }

    /* PROFILES */

    const { data: profilesData } =
      await supabase
        .from('profiles')
        .select('*')

    if (profilesData) {
      setProfiles(profilesData)
    }

    /* TEAMS */

    const { data: teamsData } =
      await supabase
        .from('teams')
        .select('*')

    if (teamsData) {
      setTeams(teamsData)
    }

  }

  const jogoLiberado = (
    matchDate: string
  ) => {

    return (
      new Date(matchDate)
      <= new Date()
    )

  }

  return (

    <main
      className="
        min-h-screen
        py-8
      "
    >

      <Navbar nome="" />

      <div
        className="
          w-full
          flex
          justify-center
          px-6
          mt-10
        "
      >

        <div
          className="
            w-full
            max-w-5xl
            flex
            flex-col
            gap-8
          "
        >

          <h1
            className="
              text-4xl
              font-bold
              text-center
              mb-4
            "
          >
            Palpites Públicos
          </h1>

          {games.map((game) => {

            const liberado =
              jogoLiberado(
                game.match_date
              )

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
              bets.filter(
                (bet) =>
                  bet.game_id ===
                  game.id
              )

            return (

              <section
                key={game.id}
                className="
                  bg-zinc-900/20
                  rounded-[10px]
                  p-8
                "
              >

                {/* JOGO */}

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    gap-5
                    flex-wrap
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <img
                      src={`https://flagcdn.com/w320/${homeTeam?.flag}.png`}
                      className="
                        w-10
                        h-7
                        object-cover
                        rounded
                      "
                    />

                    <p
                      className="
                        text-3xl
                        font-bold
                      "
                    >
                      {game.home_team}
                    </p>

                  </div>

                  <span
                    className="
                      text-white/60
                      uppercase
                    "
                  >
                    vs
                  </span>

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <p
                      className="
                        text-3xl
                        font-bold
                      "
                    >
                      {game.away_team}
                    </p>

                    <img
                      src={`https://flagcdn.com/w320/${awayTeam?.flag}.png`}
                      className="
                        w-10
                        h-7
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
                    text-white/60
                    mt-4
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

                {/* PALPITES */}

                <div
                  className="
                    mt-8
                    flex
                    flex-col
                    gap-3
                  "
                >

                  {betsDoJogo.map((bet) => {

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
                          items-center
                          justify-between
                          bg-zinc-800/40
                          px-5
                          py-4
                          rounded-[8px]
                        "
                      >

                        <p
                          className="
                            font-semibold
                          "
                        >
                          {profile?.nome}
                        </p>

                        {liberado ? (

                          <p
                            className="
                              text-2xl
                              font-bold
                            "
                          >
                            {bet.home_guess}
                            {' x '}
                            {bet.away_guess}
                          </p>

                        ) : (

                          <p
                            className="
                              text-2xl
                            "
                          >
                            🔒
                          </p>

                        )}

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