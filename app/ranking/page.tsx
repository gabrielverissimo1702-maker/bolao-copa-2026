'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { supabase } from '../../lib/supabase'

import Navbar from '../components/Navbar'
import RankingCompleto from '../components/RankingCompleto'

export default function Ranking() {

  const [perfil, setPerfil] =
    useState<any>(null)

  const [ranking, setRanking] =
    useState<any[]>([])

  useEffect(() => {

    const carregar = async () => {

      const { data } =
        await supabase.auth.getUser()

      if (!data.user) {

        window.location.href =
          '/login'

        return

      }

      const { data: meuPerfil } =
        await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

      if (meuPerfil) {
        setPerfil(meuPerfil)
      }

      const { data: profilesData } =
        await supabase
          .from('profiles')
          .select('*')

      const { data: allBets } =
        await supabase
          .from('bets')
          .select('*')

      const { data: gamesData } =
        await supabase
          .from('games')
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

      {/* CONTAINER */}

      <div
        className="
          w-full
          flex
          justify-center
          px-4
          md:px-6
          mt-10
        "
      >

        <div
          className="
            w-full
            max-w-4xl
          "
        >

          <RankingCompleto
            ranking={ranking}
            completo={true}
          />

        </div>

      </div>

<br></br>
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
        text-[18px]
        font-xl
        whitespace-nowrap
        backdrop-blur-sm
      "
    >
      HOME
    </Link>

    {/* CLASSIFICAÇÃO */}

    <Link
      href="/jogos"
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
        text-[18px]
        font-xl
        whitespace-nowrap
        backdrop-blur-sm
      "
    >
      MEUS PALPITES
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
        text-[15px]
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