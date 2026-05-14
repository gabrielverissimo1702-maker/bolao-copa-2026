type Props = {
  ranking: any[]
  completo?: boolean
}

export default function RankingPreview({
  ranking,
  completo = false
}: Props) {

  const lista =
    completo
      ? ranking
      : ranking.slice(0, 10)

  return (

    <section
  className="
    max-w-4xl
    mx-auto
    w-full
  "
>

      {/* TÍTULO */}

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
          Copa do Mundo 2026
        </p>
<br></br><br></br>
        <h2
          className="
            text-4xl
            font-semibold
            tracking-tight
          "
        >
          Classificação
        </h2>

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
            grid-cols-[120px_1fr_160px_160px]
            px-8
            py-5
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

        {/* LINHAS */}

        {lista.map((user, index) => (

          <div
            key={index}
            className="
              grid
              grid-cols-[120px_1fr_160px_160px]
              items-center
              px-8
              py-5
              border-b
              border-white/5
            "
          >

            {/* POSIÇÃO */}

            <div className="flex justify-center">

              <div
                className="
                  w-14
                  h-14
                  bg-zinc-00
                  rounded-[10px]
                  flex
                  items-center
                  justify-center
                  text-xl
                  font-bold
                "
              >
                {index + 1}
              </div>

            </div>

            {/* NOME */}

            <div
              className="
                text-2xl
                font-semibold
              "
            >
              {user.nome}
            </div>

            {/* PONTOS */}

            <div className="flex justify-center">

              <div
                className="
                  min-w-[70px]
                  h-14
                  px-4
                  bg-zinc-00
                  rounded-[10px]
                  flex
                  items-center
                  justify-center
                  text-xl
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
                  min-w-[70px]
                  h-14
                  px-4
                  bg-zinc-00
                  rounded-[10px]
                  flex
                  items-center
                  justify-center
                  text-xl
                  font-bold
                "
              >
                {user.cravadas}
              </div>

            </div>

          </div>

        ))}

      </div>

    </section>

  )

}