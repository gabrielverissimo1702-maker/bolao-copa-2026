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
          />

        </div>

      </div>

      {/* BOTÕES */}

      <div
        className="
          w-full
          flex
          justify-center
          mt-20
          pb-20
          px-4
          md:px-6
        "
      >

        <div
          className="
            w-full
            max-w-4xl
            grid
            grid-cols-1
            md:grid-cols-3
            gap-6
            md:gap-10
            items-center
            justify-items-center
          "
        >

          {/* VOLTAR */}

          <button
            onClick={() =>
              history.back()
            }
            className="
              w-full
              md:w-auto
              border
              border-white/10
              bg-white/5
              hover:bg-white/10
              transition
              px-10
              py-5
              rounded-[8px]
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

              window.location.href =
                '/login'

            }}
            className="
              w-full
              md:w-auto
              border
              border-white/10
              bg-white/5
              hover:bg-white/10
              transition
              px-16
              py-6
              rounded-[8px]
              text-xl
              font-medium
              backdrop-blur-sm
            "
          >
            SAIR
          </button>

          {/* PALPITES */}

          <Link
            href="/jogos"
            className="
              w-full
              md:w-auto
              text-center
              border
              border-white/10
              bg-white/5
              hover:bg-white/10
              transition
              px-10
              py-5
              rounded-[8px]
              text-lg
              font-medium
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