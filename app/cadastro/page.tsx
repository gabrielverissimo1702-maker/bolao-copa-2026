'use client'

import { useState } from 'react'

import Link from 'next/link'

import { supabase } from '../../lib/supabase'

export default function Cadastro() {

  const [nome, setNome] =
    useState('')

  const [email, setEmail] =
    useState('')

  const [senha, setSenha] =
    useState('')

  const cadastrar =
    async () => {

      const { data, error } =
        await supabase.auth.signUp({
          email,
          password: senha
        })

      if (error) {

        alert(error.message)

        return

      }

      const user =
        data.user

      if (user) {

       await supabase
  .from('profiles')
  .insert({
    id: user.id,
    nome: nome.toUpperCase()
  })

      }

      alert(
        'Conta criada!'
      )

      window.location.href =
        '/login'

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
            Criar Conta
          </h1>

        </div>

        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) =>
            setNome(
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
          onClick={cadastrar}
          className="
            bg-white
            text-black
            h-14
            rounded-[4px]
            font-bold
          "
        >
          Criar conta
        </button>

        <Link
          href="/login"
          className="
            text-center
            text-white/60
            hover:text-white
            transition
          "
        >
          Já tenho conta
        </Link>

      </div>

    </main>

  )

}