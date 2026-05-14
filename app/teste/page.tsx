'use client'

import { useEffect } from 'react'

export default function Teste() {

  useEffect(() => {

    const buscar = async () => {

      const response =
        await fetch(
          'https://v3.football.api-sports.io/leagues?search=world cup',
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

      console.log(data)

    }

    buscar()

  }, [])

  return (
    <div>
      Buscando Copa...
    </div>
  )

}