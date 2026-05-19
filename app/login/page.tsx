// app/login/page.tsx

'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { supabase } from '../../lib/supabase'

export default function LoginPage() {

  const router = useRouter()

  /* LOGIN */

  const [login, setLogin] =
    useState('')

  const [password, setPassword] =
    useState('')

  /* FIRST ACCESS */

  const [primeiroAcesso,
    setPrimeiroAcesso] =
      useState(false)

  const [codigo,
    setCodigo] =
      useState('')

  const [codigoValido,
    setCodigoValido] =
      useState(false)

  /* CREATE ACCOUNT */

  const [nome, setNome] =
    useState('')

  const [iniciais,
    setIniciais] =
      useState('')

  const [novoLogin,
    setNovoLogin] =
      useState('')

  const [novaSenha,
    setNovaSenha] =
      useState('')

  const [confirmarSenha,
    setConfirmarSenha] =
      useState('')

  const [loading,
    setLoading] =
      useState(false)

  /* LOGIN */

  const entrar =
    async () => {

      setLoading(true)

      const email =
        `${login}@bolao.com`

      const { error } =
        await supabase.auth
          .signInWithPassword({

            email,
            password

          })

      setLoading(false)

      if (error) {

        alert(
          'Login ou senha inválidos'
        )

        return

      }

      router.push('/')

    }

  /* VALIDAR CÓDIGO */

  const validarCodigo =
    async () => {

      if (!codigo)
        return

      setLoading(true)

      const { data, error } =
        await supabase
          .from('access_codes')
          .select('*')
          .eq(
            'code',
            codigo.toUpperCase()
          )
          .eq('used', false)
          .single()

      setLoading(false)

      if (error || !data) {

        alert(
          'Código inválido'
        )

        return

      }

      setCodigoValido(true)

    }

  /* CREATE ACCOUNT */

  const criarConta =
    async () => {

      if (
        !nome ||
        !iniciais ||
        !novoLogin ||
        !novaSenha
      ) {

        alert(
          'Preencha todos os campos'
        )

        return

      }

      if (
        novaSenha !==
        confirmarSenha
      ) {

        alert(
          'As senhas não coincidem'
        )

        return

      }

      setLoading(true)

      /* CHECK LOGIN */

      const {
        data: loginExiste
      } = await supabase
        .from('profiles')
        .select('login')
        .eq(
          'login',
          novoLogin
        )
        .single()

      if (loginExiste) {

        setLoading(false)

        alert(
          'Login já utilizado'
        )

        return

      }

      /* SIGNUP */

      const email =
        `${novoLogin}@bolao.com`

      const {
        data,
        error
      } =
        await supabase.auth
          .signUp({

            email,
            password:
              novaSenha

          })

      if (
        error ||
        !data.user
      ) {

        setLoading(false)

        alert(
          'Erro ao criar conta'
        )

        return

      }

      /* PROFILE */

      await supabase
        .from('profiles')
        .insert({

          id:
            data.user.id,

          nome,

          iniciais:
            iniciais
              .toUpperCase(),

          login:
            novoLogin,

          pontos: 0,

          cravadas: 0

        })

      /* USED CODE */

      await supabase
        .from('access_codes')
        .update({
          used: true
        })
        .eq(
          'code',
          codigo.toUpperCase()
        )

      setLoading(false)

      alert(
        'Conta criada!'
      )

      router.push('/')

    }

  return (

    <main
      style={{
        minHeight: '100vh',

        background:
          '#050505',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        padding: '20px',

        color: 'white'
      }}
    >

      <div
        style={{
          width: '100%',

          maxWidth: '420px',

          borderRadius: '28px',

          border:
            '1px solid rgba(255,255,255,0.08)',

          background:
            'rgba(255,255,255,0.03)',

          backdropFilter:
            'blur(20px)',

          padding:
            '34px 26px'
        }}
      >

        {/* TITLE */}

        <div
          style={{
            marginBottom: '30px'
          }}
        >

          <p
            style={{
              color: '#00ff9d',

              letterSpacing:
                '0.28em',

              fontSize: '10px',

              marginBottom: '10px'
            }}
          >
            COPA DO MUNDO 2026
          </p>

          <h1
            className="fifa-title"

            style={{
              fontSize: '54px',

              lineHeight: 0.9,

              marginBottom: '10px'
            }}
          >
            BOLÃO{' '}

            <span
              style={{
                color: '#00ff9d'
              }}
            >
              2026
            </span>

          </h1>

          <p
            style={{
              opacity: 0.6,

              lineHeight: 1.5
            }}
          >
            Faça login para
            acessar o bolão.
          </p>

        </div>

        {/* LOGIN */}

        {!codigoValido && (

          <>

            {/* LOGIN */}

            <div
              style={{
                marginBottom: '14px'
              }}
            >

              <label
                style={{
                  fontSize: '12px',

                  opacity: 0.7
                }}
              >
                LOGIN
              </label>

              <input
                value={login}

                onChange={(e) =>
                  setLogin(
                    e.target.value
                  )
                }

                placeholder="nomesobrenome"

                style={{
                  width: '100%',

                  height: '56px',

                  marginTop: '8px',

                  borderRadius:
                    '16px',

                  border:
                    '1px solid rgba(255,255,255,0.08)',

                  background:
                    'rgba(255,255,255,0.03)',

                  padding:
                    '0 18px',

                  color: 'white',

                  fontSize: '16px',

                  outline: 'none'
                }}
              />

            </div>

            {/* SENHA */}

            <div
              style={{
                marginBottom: '20px'
              }}
            >

              <label
                style={{
                  fontSize: '12px',

                  opacity: 0.7
                }}
              >
                SENHA
              </label>

              <input
                type="password"

                value={password}

                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }

                placeholder="********"

                style={{
                  width: '100%',

                  height: '56px',

                  marginTop: '8px',

                  borderRadius:
                    '16px',

                  border:
                    '1px solid rgba(255,255,255,0.08)',

                  background:
                    'rgba(255,255,255,0.03)',

                  padding:
                    '0 18px',

                  color: 'white',

                  fontSize: '16px',

                  outline: 'none'
                }}
              />

            </div>

            {/* BUTTON */}

            <button
              onClick={entrar}

              disabled={loading}

              style={{
                width: '100%',

                height: '58px',

                borderRadius:
                  '16px',

                border: 'none',

                background:
                  'linear-gradient(90deg,#00ff9d,#00c3ff)',

                color: 'black',

                fontWeight:
                  'bold',

                fontSize: '13px',

                letterSpacing:
                  '0.08em',

                textTransform:
                  'uppercase',

                cursor: 'pointer'
              }}
            >
              {
                loading
                  ? 'Entrando...'
                  : 'Entrar'
              }
            </button>

            {/* FIRST ACCESS */}

            <div
              style={{
                marginTop: '24px',

                textAlign:
                  'center'
              }}
            >

              <button
                onClick={() =>
                  setPrimeiroAcesso(
                    !primeiroAcesso
                  )
                }

                style={{
                  background:
                    'transparent',

                  border: 'none',

                  color: '#00ff9d',

                  cursor: 'pointer',

                  fontWeight:
                    'bold'
                }}
              >
                Primeiro acesso?
              </button>

            </div>

            {/* CODE */}

            {primeiroAcesso && (

              <div
                style={{
                  marginTop: '18px'
                }}
              >

                <input
                  value={codigo}

                  onChange={(e) =>
                    setCodigo(
                      e.target.value
                    )
                  }

                  placeholder="Digite o código"

                  style={{
                    width: '100%',

                    height: '56px',

                    borderRadius:
                      '16px',

                    border:
                      '1px solid rgba(255,255,255,0.08)',

                    background:
                      'rgba(255,255,255,0.03)',

                    padding:
                      '0 18px',

                    color: 'white',

                    fontSize: '16px',

                    outline: 'none'
                  }}
                />

                <button
                  onClick={
                    validarCodigo
                  }

                  style={{
                    width: '100%',

                    height: '54px',

                    marginTop: '12px',

                    borderRadius:
                      '16px',

                    border:
                      '1px solid rgba(0,255,157,0.22)',

                    background:
                      'rgba(0,255,157,0.08)',

                    color: '#00ff9d',

                    fontWeight:
                      'bold',

                    cursor: 'pointer'
                  }}
                >
                  Continuar
                </button>

              </div>

            )}

          </>

        )}

        {/* CREATE ACCOUNT */}

        {codigoValido && (

          <div>

            <p
              style={{
                marginBottom: '20px',

                opacity: 0.7
              }}
            >
              Crie sua conta
            </p>

            {/* NOME */}

            <input
              value={nome}

              onChange={(e) =>
  setNome(
    e.target.value.toUpperCase()
  )
}

              placeholder="Nome"

              style={inputStyle}
            />

            {/* INICIAIS */}

            <input
              value={iniciais}

              maxLength={3}

              onChange={(e) =>
                setIniciais(
  e.target.value.toUpperCase()
)
              }

              placeholder="Iniciais"

              style={{
                ...inputStyle,

                marginTop: '12px'
              }}
            />

            {/* LOGIN */}

            <input
              value={novoLogin}

              onChange={(e) =>
                setNovoLogin(
  e.target.value
    .toLowerCase()
    .replace(/\s/g, '')
)
              }

              placeholder="Login"

              style={{
                ...inputStyle,

                marginTop: '12px'
              }}
            />

            {/* PASS */}

            <input
              type="password"

              value={novaSenha}

              onChange={(e) =>
                setNovaSenha(
                  e.target.value
                )
              }

              placeholder="Senha"

              style={{
                ...inputStyle,

                marginTop: '12px'
              }}
            />

            {/* CONFIRM */}

            <input
              type="password"

              value={
                confirmarSenha
              }

              onChange={(e) =>
                setConfirmarSenha(
                  e.target.value
                )
              }

              placeholder="Confirmar senha"

              style={{
                ...inputStyle,

                marginTop: '12px'
              }}
            />

            {/* BTN */}

            <button
              onClick={
                criarConta
              }

              style={{
                width: '100%',

                height: '58px',

                marginTop: '20px',

                borderRadius:
                  '16px',

                border: 'none',

                background:
                  'linear-gradient(90deg,#00ff9d,#00c3ff)',

                color: 'black',

                fontWeight:
                  'bold',

                fontSize: '13px',

                letterSpacing:
                  '0.08em',

                textTransform:
                  'uppercase',

                cursor: 'pointer'
              }}
            >
              Criar conta
            </button>

          </div>

        )}

      </div>

    </main>

  )

}

/* INPUT */

const inputStyle = {

  width: '100%',

  height: '56px',

  borderRadius: '16px',

  border:
    '1px solid rgba(255,255,255,0.08)',

  background:
    'rgba(255,255,255,0.03)',

  padding:
    '0 18px',

  color: 'white',

  fontSize: '16px',

  outline: 'none'

}