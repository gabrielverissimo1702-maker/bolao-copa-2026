'use client'

import { useEffect } from 'react'

import { supabase } from '../../lib/supabase'

export default function Importar() {

  useEffect(() => {

    const importar =
      async () => {

        const response =
          await fetch(
            'https://v3.football.api-sports.io/fixtures?league=1&season=2022',
            {
              headers: {
                'x-apisports-key':
                  process.env
                    .NEXT_PUBLIC_FOOTBALL_API!
              }
            }
          )

        const data =
          await response.json()

        const jogos =
          data.response

        console.log(jogos)

        for (const jogo of jogos) {

          const fixture =
            jogo.fixture

          const teams =
            jogo.teams

          const goals =
            jogo.goals

          await supabase
            .from('games')
            .upsert({

              api_id:
                fixture.id,

              home_team:
                teams.home.name,

              away_team:
                teams.away.name,

              match_date:
                fixture.date,

              home_score:
                goals.home,

              away_score:
                goals.away,

              round:
                1,

              group_name:
                'Copa do Mundo'

            })

        }

        alert(
          'Jogos importados!'
        )

      }

    importar()

  }, [])

  return (
    <div>
      Importando jogos...
    </div>
  )

}