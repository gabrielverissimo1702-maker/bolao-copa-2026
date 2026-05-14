import Link from 'next/link'

type Props = {
  ranking: any[]
}

export default function RankingPreview({
  ranking
}: Props) {

  return (

    <section>

      {/* TÍTULO */}
<br></br><br></br><br></br>

      <div className="mb-8 text-center">

        <p
          className="
            text-white/70
            uppercase
            tracking-[0.3em]
            text-xs
            mb-3
          "
        >
          TOP 7
        </p>

        <Link
          href="/ranking"
          className="
            text-4xl
            font-semibold
            tracking-tight
            hover:text-white/80
            transition
            inline-block
          "
        >
          Classificação
        </Link>

      </div>

      {/* TABELA */}

      <div
        className="
          bg-zinc-900/10
          rounded-[10px]
          overflow-hidden
        "
      >

        {/* HEADER */}

        <div
          className="
            grid
            grid-cols-[100px_1fr_120px_140px]
            px-6
            py-4
            border-b
            border-white/10
            text-white/60
            uppercase
            tracking-[0.2em]
            text-sm
          "
        >

          <div className="text-center">
            Pos
          </div>

          <div>
            Nome
          </div>

          <div className="text-center">
            Pts
          </div>

          <div className="text-center">
            Cravadas
          </div>

        </div>

        {/* TOP 7 */}

        {ranking.slice(0, 7).map((user, index) => (

          <div
            key={index}
            className="
              grid
              grid-cols-[100px_1fr_120px_140px]
              items-center
              px-6
              py-4
              border-b
              border-white/5
            "
          >

            {/* POSIÇÃO */}

            <div className="flex justify-center">

              <div
                className="
                  w-12
                  h-12
                  bg-zinc-00
                  rounded-[10px]
                  flex
                  items-center
                  justify-center
                  text-lg
                  font-bold
                "
              >
                {index + 1}
              </div>

            </div>

            {/* NOME */}

            <div
              className="
                text-xl
                font-semibold
              "
            >
              {user.nome}
            </div>

            {/* PTS */}

            <div className="flex justify-center">

              <div
                className="
                  min-w-[60px]
                  h-12
                  px-3
                  bg-zinc-00
                  rounded-[10px]
                  flex
                  items-center
                  justify-center
                  text-lg
                  font-bold
                "
              >
                {user.pontos}
              </div>

            </div>

            {/* CRAVADAS */}

            <div className="flex justify-center">

              <div
                className="
                  min-w-[60px]
                  h-12
                  px-3
                  bg-zinc-00
                  rounded-[10px]
                  flex
                  items-center
                  justify-center
                  text-lg
                  font-bold
                "
              >
                {user.cravadas}
              </div>

            </div>

          </div>

        ))}

      </div>

      {/* BOTÃO */}

      <div className="flex justify-center mt-6">

        <Link
          href="/ranking"
          className="
            border
            border-white/10
            bg-white/5
            hover:bg-white/10
            transition
            px-20
            py-10
            rounded-[8px]
            text-sm
            font-medium
            backdrop-blur-sm
          "
        >
          Ver classificação completa
        </Link>

      </div>
<br></br><br></br>

    </section>

  )

}