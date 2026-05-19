import Link from 'next/link'

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
        w-full
         max-w-5xl
         mx-auto
      "
    >

      {/* HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
          mb-8
        "
      >

        <div>

          <p
            className="
              text-white/40
              uppercase
              tracking-[0.35em]
              text-[10px]
              mb-2
            "
          >
            Copa do Mundo 2026
          </p>

          <h2
            className="
              text-5xl
              leading-none
            "
          >
            Ranking
          </h2>

        </div>

        {!completo && (

          <Link
            href="/ranking"
            className="
              border
              border-white/[0.08]
              bg-white/[0.03]
              hover:bg-white/[0.06]
              transition
              px-5
              py-3
              text-[11px]
              uppercase
              tracking-[0.25em]
            "
          >
            Ver tudo
          </Link>

        )}

      </div>

      {/* LISTA */}

      <div
        className="
          flex
          flex-col
          gap-3
        "
      >

        {lista.map((user, index) => {

          const top3 =
            index <= 2

          return (

            <div
              key={index}
              className={`
                relative
                overflow-hidden
                border
                transition
                px-4
                py-4

                ${
                  top3

                    ? `
                      border-[#ffd000]/20
                      bg-[#ffd000]/[0.04]
                    `

                    : `
                      border-white/[0.06]
                      bg-white/[0.02]
                    `
                }
              `}
            >

              {/* GLOW */}

              {top3 && (

                <div
                  className="
                    absolute
                    top-0
                    right-0
                    w-32
                    h-32
                    bg-[#ffd000]/10
                    blur-3xl
                    pointer-events-none
                  "
                />

              )}

              {/* CONTEÚDO */}

              <div
                className="
                  relative
                  z-10
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >

                {/* ESQUERDA */}

                <div
                  className="
                    flex
                    items-center
                    gap-4
                    min-w-0
                  "
                >

                  {/* POS */}

                  <div
                    className={`
                      w-14
                      h-14
                      shrink-0
                      flex
                      items-center
                      justify-center
                      text-3xl
                      leading-none
                      border

                      ${
                        top3

                          ? `
                            border-[#ffd000]/30
                            text-[#ffd000]
                            bg-[#ffd000]/10
                          `

                          : `
                            border-white/[0.06]
                            text-white/70
                            bg-white/[0.03]
                          `
                      }
                    `}
                  >
                    {index + 1}
                  </div>

                  {/* NOME */}

                  <div
                    className="
                      min-w-0
                    "
                  >

                    <p
                      className="
                        text-white/40
                        uppercase
                        tracking-[0.25em]
                        text-[9px]
                        mb-1
                      "
                    >
                      Jogador
                    </p>

                    <h3
                      className="
                        text-2xl
                        leading-none
                        truncate
                      "
                    >
                      {user.nome}
                    </h3>

                  </div>

                </div>

                {/* DIREITA */}

                <div
                  className="
                    flex
                    items-center
                    gap-3
                    shrink-0
                  "
                >

                  {/* PONTOS */}

                  <div
                    className="
                      border
                      border-[#00ffb7]/20
                      bg-[#00ffb7]/10
                      min-w-[90px]
                      px-4
                      py-3
                      text-center
                    "
                  >

                    <p
                      className="
                        text-[#00ffb7]
                        uppercase
                        tracking-[0.2em]
                        text-[9px]
                        mb-1
                      "
                    >
                      Pts
                    </p>

                    <p
                      className="
                        text-2xl
                        leading-none
                      "
                    >
                      {user.pontos ?? 0}
                    </p>

                  </div>

                  {/* CRAVADAS */}

                  <div
                    className="
                      border
                      border-[#ffd000]/20
                      bg-[#ffd000]/10
                      min-w-[90px]
                      px-4
                      py-3
                      text-center
                    "
                  >

                    <p
                      className="
                        text-[#ffd000]
                        uppercase
                        tracking-[0.2em]
                        text-[9px]
                        mb-1
                      "
                    >
                      Cravadas
                    </p>

                    <p
                      className="
                        text-2xl
                        leading-none
                      "
                    >
                      {user.cravadas ?? 0}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          )

        })}

      </div>

    </section>

  )

}