'use client'

import { useState } from 'react'

import Link from 'next/link'

import { supabase } from '../../lib/supabase'

export default function Login() {

  const [email, setEmail] =
    useState('')

  const [senha, setSenha] =
    useState('')

  const entrar = async () => {

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password: senha
      })

    if (error) {

      alert(error.message)

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
      "
    >

      <div
        className="
          w-full
          max-w-md
          bg-zinc-900/20
          p-10
          rounded-[10px]
          flex
          flex-col
          gap-6
        "
      >

        <div className="text-center">

          <p
            className="
              text-white/60
              uppercase
              tracking-[0.3em]
              text-xs
              mb-3
            "
          >
            BOLÃO COPA DO MUNDO 2026
          </p>

          <h1
            className="
              text-4xl
              font-bold
            "
          >
            Entrar
          </h1>

        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          className="
            bg-zinc-800
            h-14
            px-4
            rounded-[4px]
          "
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) =>
            setSenha(
              e.target.value
            )
          }
          className="
            bg-zinc-800
            h-14
            px-4
            rounded-[4px]
          "
        />

        <button
          onClick={entrar}
          className="
            bg-white
            text-black
            h-14
            rounded-[4px]
            font-bold
          "
        >
          Entrar
        </button>

        <Link
          href="/cadastro"
          className="
            text-center
            text-white/60
            hover:text-white
            transition
          "
        >
          Criar conta
        </Link>

      </div>

    </main>

  )

}