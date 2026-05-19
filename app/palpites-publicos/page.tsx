'use client'

import Link from 'next/link'

import { useEffect, useMemo, useState } from 'react'

import Navbar from '@/app/components/Navbar'

import { supabase } from '@/lib/supabase'

export default function PalpitesPublicos() {

  const [perfil, setPerfil] =
    useState<any>(null)

  const [games, setGames] =
    useState<any[]>([])

  const [bets, setBets] =
    useState<any[]>([])

  const [profiles, setProfiles] =
    useState<any[]>([])

  const [teams, setTeams] =
    useState<any[]>([])

  const [pagina, setPagina] =
    useState(1)

  useEffect(() => {

    carregar()

  }, [])

  const carregar = async () => {

    const { data } =
      await supabase.auth.getUser()

    if (!data.user) {

      window.location.href =
        '/login'

      return

    }

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

  /* PÁGINA INICIAL */

  const paginaInicial =
    useMemo(() => {

      const index =
        games.findIndex(
          (game) =>
            new Date(
              game.match_date
            ) > new Date()
        )

      if (index === -1) {
        return 1
      }

      return (
        Math.floor(index / 6) + 1
      )

    }, [games])

  useEffect(() => {

    if (pagina === 1) {
      setPagina(paginaInicial)
    }

  }, [paginaInicial])

  /* PAGINAÇÃO */

  const jogosPorPagina = 6

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

      <br></br><br></br>
<div className="text-center mb-12">

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
    Palpites Adversários
  </h1>

</div>
      {/* CONTAINER */}

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
            max-w-7xl
          "
        >

          {/* PAGINAÇÃO TOPO */}

          <div
            className="
              flex
              items-center
              justify-center
              gap-6
              mb-10
            "
          >

            <button
              disabled={pagina === 1}
              onClick={() =>
                setPagina(
                  pagina - 1
                )
              }
              className="
                w-12
                h-12
                rounded-[10px]
                bg-zinc-00
                text-xl
                font-bold
                disabled:opacity-30
              "
            >
              ←
            </button>

            <p
              className="
                text-white/70
                uppercase
                tracking-[0.2em]
                text-sm
              "
            >
              Página {pagina}
            </p>

            <button
              disabled={
                pagina ===
                totalPaginas
              }
              onClick={() =>
                setPagina(
                  pagina + 1
                )
              }
              className="
                w-12
                h-12
                rounded-[10px]
                bg-zinc-00
                text-xl
                font-bold
                disabled:opacity-30
              "
            >
              →
            </button>

          </div>
<br></br>
          {/* GRID */}

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-8
            "
          >

            {jogosPaginados.map((game) => {

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

                <section
                  key={game.id}
                  className="
                    bg-zinc-900/10
                    rounded-[16px]
                    p-6
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
                          w-9
                          h-7
                          object-cover
                          rounded
                        "
                      />

                      <p
                        className="
                          w-[40px]
                          text-right
                          text-xl
                          font-bold
                        "
                      >
                        {game.home_team}
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
                          w-11
                          h-11
                          bg-zinc-800
                          rounded-[8px]
                          flex
                          items-center
                          justify-center
                          text-lg
                          font-bold
                        "
                      >
                        {
                          liberado
                            ? game.home_score
                            : ''
                        }
                      </div>

                      <span
                        className="
                          text-white/60
                          text-sm
                          font-semibold
                        "
                      >
                        x
                      </span>

                      <div
                        className="
                          w-11
                          h-11
                          bg-zinc-800
                          rounded-[8px]
                          flex
                          items-center
                          justify-center
                          text-lg
                          font-bold
                        "
                      >
                        {
                          liberado
                            ? game.away_score
                            : ''
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
                          w-[40px]
                          text-left
                          text-xl
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
                      game.match_date
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
                            liberado
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
                            liberado
                              ? meuPalpite.away_guess
                              : ''
                          }
                        </div>

                      </div>

                    </div>

                  )}
                  <br></br>
                  {/* LINHA */}

                  <div
                    className="
                      w-full
                      h-px
                      bg-white/
                      my-10
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

                    {outrosPalpites.map((bet) => {

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
                                liberado
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
                                liberado
                                  ? bet.away_guess
                                  : ''
                              }
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

          {/* PAGINAÇÃO BAIXO */}

          <br></br>

          <div
            className="
              flex
              items-center
              justify-center
              gap-6
              mt-10
            "
          >

            <button
              disabled={pagina === 1}
              onClick={() =>
                setPagina(
                  pagina - 1
                )
              }
              className="
                w-12
                h-12
                rounded-[10px]
                bg-zinc-00
                text-xl
                font-bold
                disabled:opacity-30
              "
            >
              ←
            </button>

            <p
              className="
                text-white/70
                uppercase
                tracking-[0.2em]
                text-sm
              "
            >
              Página {pagina}
            </p>

            <button
              disabled={
                pagina ===
                totalPaginas
              }
              onClick={() =>
                setPagina(
                  pagina + 1
                )
              }
              className="
                w-12
                h-12
                rounded-[10px]
                bg-zinc-00
                text-xl
                font-bold
                disabled:opacity-30
              "
            >
              →
            </button>

            

          </div>

        </div>

      </div>

      <br>
      </br>
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
      items-center
      justify-items-center
    "
  >

    {/* HOME */}

    <Link
      href="/"
      className="
        w-full
        text-center
        border
        border-white/
        bg-black/50
        hover:bg-white/2
        transition
        px-2
        py-4
        rounded-[8px]
        text-[17px]
        font-xl
        whitespace-nowrap
        backdrop-blur-sm
      "
    >
      HOME
    </Link>

    {/* CLASSIFICAÇÃO */}

    <Link
      href="/ranking"
      className="
         w-full
        text-center
        border
        border-white/
        bg-black/50
        hover:bg-white/2
        transition
        px-2
        py-4
        rounded-[8px]
        text-[17px]
        font-xl
        whitespace-nowrap
        backdrop-blur-sm
      "
    >
      CLASSIFICAÇÃO
    </Link>

    {/* PALPITES ADVERSÁRIOS */}

    <Link
      href="/jogos2"
      className="
         w-full
        text-center
        border
        border-white/
        bg-black/50
        hover:bg-white/2
        transition
        px-2
        py-4
        rounded-[8px]
        text-[17px]
        font-xl
        whitespace-nowrap
        backdrop-blur-sm
      "
    >
      MEUS PALPITES
    </Link>

  </div>

</div>

    </main>

  )

}