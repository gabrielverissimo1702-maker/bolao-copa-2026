import Link from 'next/link'

type Props = {
  nome: string
}

export default function Navbar({
  nome
}: Props) {

  return (

    <nav
      className="
        relative
        w-full
        mt-16
        mb-32
        border-t
        border-[#50f902]/
        pt-12
      "
    >

      {/* CONTEÚDO */}

      <div
        className="
          relative
          z-10
          flex
          flex-col
          items-center
          justify-center
          py-28
          text-center
        "
      >

        {/* BEM-VINDO */}

        <p
          className="
            text-xl
            tracking-[0.3em]
            uppercase
            mb-6
            text-white/70
          "
        >
          Bem-vindo
        </p>

        {/* NOME */}

        <h2
          className="
            text-4xl
            font-semibold
            tracking-tight
            text-white
            mb-8
          "
        >
          {nome}
        </h2>

        {/* TEXTO */}

        <p
          className="
            text-2xl
            text-white/80
            max-w-3xl
            mb-16
          "
        >
          Bolão da Copa do Mundo 2026
        </p>

        {/* LINK */}

        <Link
          href="/"
          className="
            text-2xl
            tracking-[0.3em]
            uppercase
            text-white
            hover:text-white/70
            transition
          "
        >
          Página Inicial
        </Link>

      </div>

    </nav>

  )

}