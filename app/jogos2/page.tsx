'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { supabase } from '../../lib/supabase'

import Navbar from '../components/Navbar'

export default function Central() {

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

      /* PERFIS */

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
          Central de Comparações
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
            max-w-4xl
            flex
            flex-col
            gap-8
          "
        >

          {games.map((game) => {

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

            const meuPalpite =
              palpites[game.id]

            return (

              <section
                key={game.id}
                className="
                  bg-white/[0.03]
                  border
                  border-white/[0.06]
                  backdrop-blur-xl
                  rounded-[24px]
                  p-6
                  shadow-2xl
                "
              >

                {/* TOPO */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    mb-6
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
                        w-9
                        h-7
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

                  {/* VS */}

                  <div
                    className="
                      text-white/50
                      text-sm
                      uppercase
                      tracking-[0.3em]
                    "
                  >
                    VS
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
                        w-9
                        h-7
                        rounded
                        object-cover
                      "
                    />

                  </div>

                </div>

                {/* MEU PALPITE */}

                <div
                  className="
                    bg-[#efb905]/10
                    border
                    border-[#efb905]/20
                    rounded-[18px]
                    p-5
                    mb-6
                  "
                >

                  <p
                    className="
                      text-[#efb905]
                      uppercase
                      tracking-[0.3em]
                      text-[10px]
                      mb-4
                    "
                  >
                    Meu Palpite
                  </p>

                  <div
                    className="
                      flex
                      items-center
                      justify-center
                      gap-3
                    "
                  >

                    <div
                      className="
                        w-12
                        h-12
                        bg-black/40
                        rounded-[12px]
                        flex
                        items-center
                        justify-center
                        text-lg
                        font-bold
                      "
                    >
                      {
                        meuPalpite?.home ?? ''
                      }
                    </div>

                    <span
                      className="
                        text-white/50
                        text-sm
                        font-semibold
                      "
                    >
                      x
                    </span>

                    <div
                      className="
                        w-12
                        h-12
                        bg-black/40
                        rounded-[12px]
                        flex
                        items-center
                        justify-center
                        text-lg
                        font-bold
                      "
                    >
                      {
                        meuPalpite?.away ?? ''
                      }
                    </div>

                  </div>

                </div>

                {/* OUTROS PALPITES */}

                <div
                  className="
                    grid
                    grid-cols-2
                    sm:grid-cols-3
                    gap-3
                  "
                >

                  {betsDoJogo.map((bet) => {

                    if (
                      bet.user_id ===
                      perfil?.id
                    ) return null

                    const profile =
                      profiles.find(
                        (p) =>
                          p.id ===
                          bet.user_id
                      )

                    const igual =
                      meuPalpite &&
                      meuPalpite.home ==
                      bet.home_guess &&
                      meuPalpite.away ==
                      bet.away_guess

                    return (

                      <div
                        key={bet.id}
                        className={`
                          rounded-[16px]
                          p-4
                          border
                          backdrop-blur-md
                          transition

                          ${
                            igual
                              ? `
                                bg-[#50f902]/10
                                border-[#50f902]/20
                              `
                              : `
                                bg-white/[0.03]
                                border-white/[0.06]
                              `
                          }
                        `}
                      >

                        {/* NOME */}

                        <p
                          className="
                            text-[11px]
                            uppercase
                            tracking-[0.2em]
                            text-white/60
                            text-center
                            mb-3
                            truncate
                          "
                        >
                          {profile?.nome}
                        </p>

                        {/* PLACAR */}

                        <div
                          className="
                            flex
                            items-center
                            justify-center
                            gap-2
                          "
                        >

                          <div
                            className="
                              w-10
                              h-10
                              bg-black/30
                              rounded-[10px]
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
                              text-white/40
                              text-xs
                            "
                          >
                            x
                          </span>

                          <div
                            className="
                              w-10
                              h-10
                              bg-black/30
                              rounded-[10px]
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

                        {/* IGUAL */}

                        {igual && (

                          <p
                            className="
                              text-[#50f902]
                              text-[9px]
                              uppercase
                              tracking-[0.2em]
                              text-center
                              mt-3
                            "
                          >
                            Igual ao seu
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

      {/* BOTÕES */}

      <div
        className="
          w-full
          flex
          justify-center
          mt-24
          pb-20
          px-4
        "
      >

        <div
          className="
            w-full
            max-w-5xl
            grid
            grid-cols-3
            gap-2
          "
        >

          <Link
            href="/"
            className="
              w-full
              text-center
              border
              border-white/10
              bg-white/5
              hover:bg-white/10
              transition
              px-4
              py-4
              rounded-[12px]
              text-sm
              font-medium
            "
          >
            HOME
          </Link>

          <Link
            href="/jogos"
            className="
              w-full
              text-center
              border
              border-white/10
              bg-white/5
              hover:bg-white/10
              transition
              px-4
              py-4
              rounded-[12px]
              text-sm
              font-medium
            "
          >
            MEUS PALPITES
          </Link>

          <Link
            href="/ranking"
            className="
              w-full
              text-center
              border
              border-white/10
              bg-white/5
              hover:bg-white/10
              transition
              px-4
              py-4
              rounded-[12px]
              text-sm
              font-medium
            "
          >
            CLASSIFICAÇÃO
          </Link>

        </div>

      </div>

    </main>

  )

}