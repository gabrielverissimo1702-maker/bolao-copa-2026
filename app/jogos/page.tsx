'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { supabase } from '../../lib/supabase'

import Navbar from '../components/Navbar'

export default function Jogos() {

  const [perfil, setPerfil] = useState<any>(null)

  const [games, setGames] = useState<any[]>([])

  const [teams, setTeams] = useState<any[]>([])

  const [palpites, setPalpites] = useState<any>({})

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
      <div
        className="
          w-full
          flex
          justify-center
          mt-10
          px-6
        "
      >

        <div
          className="
            w-full
            max-w-5xl
          "
        >

          {/* LISTA */}

          <div
            className="
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
                    p-8
                  "
                >

                  {/* GRUPO */}

                  <p
                    className="
                      text-sm
                      uppercase
                      tracking-[0.3em]
                      text-white/70
                      mb-6
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
                          text-4xl
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
                      disabled={bloqueado}
                      className="
                        w-14
                        h-14
                        bg-zinc-800
                        rounded-[10px]
                        text-center
                        text-2xl
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
                      disabled={bloqueado}
                      className="
                        w-14
                        h-14
                        bg-zinc-800
                        rounded-[10px]
                        text-center
                        text-2xl
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
                        flex
                        items-center
                        gap-4
                      "
                    >

                      <p
                        className="
                          text-4xl
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

                  {/* BLOQUEADO */}

                  {bloqueado && (

                    <p
                      className="
                        text-red-400
                        text-sm
                        uppercase
                        tracking-[0.2em]
                        mt-2
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

            {/* ANTERIOR */}

            <button
              disabled={pagina === 1}
              onClick={() =>
                setPagina(
                  pagina - 1
                )
              }
              className="
                w-14
                h-14
                rounded-[10px]
                bg-zinc-800
                text-2xl
                font-bold
                disabled:opacity-30
              "
            >
              ←
            </button>

            {/* PÁGINA */}

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

            {/* PRÓXIMA */}

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
                w-14
                h-14
                rounded-[10px]
                bg-zinc-800
                text-2xl
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
        "
      >

        <button
          onClick={salvarPalpites}
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
          px-6
        "
      >

        <div
  className="
    w-full
    max-w-5xl
    grid
    grid-cols-3
    gap-10
    items-center
    justify-items-center
  "
        >

          {/* VOLTAR */}

          <button
            onClick={() => history.back()}
            className="
              border
              border-white
              bg-white/5
              hover:bg-white/10
              transition
              px-10
              py-5
              rounded-[4px]
              text-lg
              font-medium
              backdrop-blur-sm
            "
          >
            VOLTAR
          </button>

          {/* SAIR */}

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

          {/* CLASSIFICAÇÃO */}

          <Link
            href="/ranking"
            className="
              border
              border-white/1
              bg-white/5
              hover:bg-white/10
              transition
              px-10
              py-5
              rounded-[4px]
              text-lg
              font-medium
              backdrop-blur-sm
            "
          >
            CLASSIFICAÇÃO
          </Link>

        </div>

      </div>

    </main>

  )

}