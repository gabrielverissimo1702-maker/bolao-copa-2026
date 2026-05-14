type Props = {
  logout: () => void
}

export default function Header({
  logout
}: Props) {

  return (

    <header
      className="
        flex
        items-center
        justify-between
        mb-10
      "
    >

      {/* LOGO */}

      <h1
        className="
          text-6xl
          font-semibold
          tracking-tight
        "
      >
        Bolão da Copa
      </h1>

      {/* BOTÃO */}

      <button
        onClick={logout}
        className="
          border
          border-white/10
          bg-white/5
          hover:bg-white/10
          transition
          px-6
          py-3
          rounded-[10px]
          text-lg
        "
      >
        Sair
      </button>

    </header>

  )

}