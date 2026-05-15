'use client'

import { useState } from 'react'

import Link from 'next/link'

import { supabase } from '@/lib/supabase'

export default function Login() {

  const [email, setEmail] =
    useState('')

  const [senha, setSenha] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const entrar = async () => {

    if (!email || !senha) {
      return
    }

    setLoading(true)

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password: senha
      })

    setLoading(false)

    if (error) {

      alert('Email ou senha inválidos')

      return

    }

    window.location.href = '/'

  }

  return (

    <main
      className="
        min-h-screen
        flex
        items-center
        justify-center
        px-6
        relative
        overflow-hidden
      "
    >

      {/* FUNDO */}

      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top,#efb905,transparent_00%)]
          pointer-events-none
        "
      />

      {/* CARD */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-[520px]
          border
          border-white/1
          bg-zinc-900/40
          backdrop-blur-xl
          rounded-[30px]
          p-10
          shadow-2xl
        "
      >

        {/* TÍTULO */}

        <div className="text-center mb-12">

          <p
            className="
              uppercase
              tracking-[0.4em]
              text-white/40
              text-xs
              mb-4
            "
          >
            COPA DO MUNDO 2026
          </p>

          <h1
            className="
              text-5xl
              font-bold
              tracking-tight
              mb-5
            "
          >
            LOGIN
          </h1>

          <p
            className="
              text-white/60
              text-lg
            "
          >
            ENTRE PARA ACESSAR O BOLÃO
          </p>

        </div>

        {/* FORM */}

        <form
          onSubmit={(e) => {

            e.preventDefault()

            entrar()

          }}
          className="
            flex
            flex-col
            gap-8
          "
        >

          {/* EMAIL */}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="
              h-16
              px-6
              rounded-[8px]
              bg-white/5
              border
              border-white/10
              outline-none
              text-lg
              focus:border-[#efb905]
              transition
            "
          />

          {/* SENHA */}

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) =>
              setSenha(e.target.value)
            }
            className="
              h-16
              px-6
              rounded-[8px]
              bg-white/5
              border
              border-white/10
              outline-none
              text-lg
              focus:border-[#efb905]
              transition
            "
          />

          {/* BOTÃO */}

          <button
            type="submit"
            disabled={loading}
            className="
              h-16
              rounded-[20px]
              bg-[#efb905]
              text-black
              font-bold
              text-lg
              hover:scale-[1.01]
              transition
              disabled:opacity-50
            "
          >
            {
              loading
                ? 'Entrando...'
                : 'ENTRAR'
            }
          </button>

        </form>

        {/* LINK */}

        <div
          className="
            mt-10
            text-center
          "
        >

          <p className="text-white/50">
            AINDA NÃO POSSUI CONTA?
          </p>

          <Link
            href="/cadastro"
            className="
              inline-block
              mt-3
              text-[#50f902]
              font-semibold
              hover:opacity-70
              transition
            "
          >
            CRIAR CONTA
          </Link>

        </div>

      </div>

    </main>

  )

}