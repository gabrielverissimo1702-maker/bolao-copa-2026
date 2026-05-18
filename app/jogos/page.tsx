'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { supabase } from '../../lib/supabase'

import Navbar from '../components/Navbar'

export default function Jogos() {

  const [perfil, setPerfil] =
    useState<any>(null)

  const [games, setGames] =
    useState<any[]>([])

  const [teams, setTeams] =
    useState<any[]>([])

  const [palpites, setPalpites] =
    useState<any>({})

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

  const jogoBloqueado = (
    dataJogo: string
  ) => {

    return (
      new Date(dataJogo) <=
      new Date()
    )

  }

  const salvarPalpites =
    async () => {

      const { data } =
        await supabase.auth.getUser()

      if (!data.user) return

      const user = data.user

      for (const gameId in palpites) {

        const palpite =
          palpites[gameId]

        await supabase
          .from('bets')
          .upsert({
            user_id: user.id,
            game_id: Number(gameId),
            home_guess:
              Number(
                palpite.home
              ),
            away_guess:
              Number(
                palpite.away
              )
          })

      }

      alert(
        'Palpites salvos!'
      )

    }

  /* PAGINAÇÃO */

  const jogosPorPagina = 12

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

      {/* JOGOS */}

      <br></br>

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
    Meus Palpites
  </h1>

</div>

      <div
        className="
          w-full
          flex
          justify-center
          mt-10
          px-4
        "
      >

        <div
          className="
            w-full
            max-w-5xl
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
                setPagina(pagina - 1)
              }
              className="
                w-10
                h-10
                rounded-[8px]
                bg-zinc-000
                text-lg
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
                text-xs
              "
            >
              Página {pagina}
            </p>

            <button
              disabled={
                pagina === totalPaginas
              }
              onClick={() =>
                setPagina(pagina + 1)
              }
              className="
                w-10
                h-10
                rounded-[8px]
                bg-zinc-000
                text-lg
                font-bold
                disabled:opacity-30
              "
            >
              →
            </button>

          </div>
<br></br>
          {/* LISTA */}

          <div
            className="
              flex
              flex-col
              gap-6
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

              const bloqueado =
                jogoBloqueado(
                  game.match_date
                )

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

                    <input
                      type="number"
                      placeholder="0"
                      disabled={bloqueado}
                      className="
                        w-10
                        h-10
                        bg-zinc-800
                        rounded-[8px]
                        text-center
                        text-sm
                        font-bold
                        disabled:opacity-40
                      "
                      value={
                        palpites[game.id]
                          ?.home ?? ''
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
                        text-white/60
                        text-xs
                        uppercase
                        font-semibold
                      "
                    >
                      x
                    </span>

                    {/* INPUT AWAY */}

                    <input
                      type="number"
                      placeholder="0"
                      disabled={bloqueado}
                      className="
                        w-10
                        h-10
                        bg-zinc-800
                        rounded-[8px]
                        text-center
                        text-sm
                        font-bold
                        disabled:opacity-40
                      "
                      value={
                        palpites[game.id]
                          ?.away ?? ''
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

                  {/* BLOQUEADO */}

                  {bloqueado && (

                    <p
                      className="
                        text-red-400
                        text-[10px]
                        uppercase
                        tracking-[0.2em]
                        mt-3
                        text-center
                      "
                    >
                      Palpites encerrados
                    </p>

                  )}

                </section>

              )

            })}

          </div>

          <br></br>

          {/* PAGINAÇÃO */}

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
                w-10
                h-10
                rounded-[8px]
                bg-zinc-000
                text-lg
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
                text-xs
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
                w-10
                h-10
                rounded-[8px]
                bg-zinc-000
                text-lg
                font-bold
                disabled:opacity-30
              "
            >
              →
            </button>

          </div>

        </div>

      </div>

      <br></br>

      {/* SALVAR */}

      <div
        className="
          flex
          justify-center
          mt-16
          px-4
        "
      >

        <button
          onClick={salvarPalpites}
          className="
            border
            border-white/
            bg-black/70
            hover:bg-white/5
            transition
            px-2
            py-4
            rounded-[4px]
            text-xl
            font-medium
            backdrop-blur-sm
          "
        >
          SALVAR PALPITES
        </button>

      </div>

      <br></br>

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
      href="/palpites-publicos"
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
      PALPITES ADVERSÁRIOS
    </Link>

  </div>

</div>

    </main>

  )

}