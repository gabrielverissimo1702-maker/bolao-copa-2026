// app/login/page.tsx

'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { supabase } from '../../lib/supabase'

const getAuthErrorMessage = (
  message?: string
) => {

  if (
    message ===
    'Email not confirmed'
  ) {

    return (
      'Conta criada, mas o Supabase esta exigindo confirmacao de e-mail. ' +
      'Desative a confirmacao de e-mail no painel do Supabase ou confirme este usuario manualmente.'
    )

  }

  if (
    message ===
    'Invalid login credentials'
  ) {

    return 'Login ou senha invalidos'

  }

  return (
    message ||
    'Nao foi possivel autenticar agora'
  )

}

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

  const [codigoLiberado,
    setCodigoLiberado] =
      useState<any>(null)

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

  const [loadingLogin,
    setLoadingLogin] =
      useState(false)

  const [loadingCodigo,
    setLoadingCodigo] =
      useState(false)

  const [loadingCriar,
    setLoadingCriar] =
      useState(false)

  /* LOGIN */

  const entrar =
    async () => {

      if (loadingLogin) return

      if (
        !login.trim() ||
        !password.trim()
      ) {

        alert(
          'Preencha login e senha'
        )

        return

      }

      setLoadingLogin(true)

      try {

        const email =
          `${login.trim().toLowerCase()}@bolao.com`

        const { error } =
          await supabase.auth
            .signInWithPassword({

              email,
              password

            })

        if (error) {

          alert(
            getAuthErrorMessage(
              error.message
            )
          )

          return

        }

        router.push('/')

      } catch {

        alert(
          'Erro ao entrar'
        )

      } finally {

        setLoadingLogin(false)

      }

    }

  /* VALIDAR CÓDIGO */

  const validarCodigo =
    async () => {

      if (loadingCodigo) return

      const codigoLimpo =
        codigo.trim().toUpperCase()

      if (!codigoLimpo) {

        alert(
          'Digite o código de acesso'
        )

        return

      }

      setLoadingCodigo(true)

      try {

        const { data, error } =
          await supabase
            .from('access_codes')
            .select('*')
            .eq(
              'code',
              codigoLimpo
            )
            .maybeSingle()

        if (error) {

          console.error(
            'Erro ao validar código no Supabase:',
            error
          )

          alert(
            `Erro ao validar código: ${error.message}`
          )

          return

        }

        if (!data) {

          alert(
            'Código inválido'
          )

          return

        }

        const isActive =
          data.is_active !== false

        const used =
          data.used === true

        const usedCount =
          Number(data.used_count ?? 0)

        const maxUses =
          Number(data.max_uses ?? 1)

        if (!isActive) {

          alert(
            'Este código está inativo'
          )

          return

        }

        if (
          used ||
          usedCount >= maxUses
        ) {

          alert(
            'Este código já foi usado'
          )

          return

        }

        setCodigoLiberado(data)

        setCodigoValido(true)

      } catch (error) {

        console.error(
          'Erro inesperado ao validar código:',
          error
        )

        alert(
          'Erro inesperado ao validar código'
        )

      } finally {

        setLoadingCodigo(false)

      }

    }

  /* CREATE ACCOUNT */

  const criarConta =
    async () => {

      if (loadingCriar) return

      if (
        !nome.trim() ||
        !iniciais.trim() ||
        !novoLogin.trim() ||
        !novaSenha ||
        !confirmarSenha
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

      if (novaSenha.length < 6) {

        alert(
          'A senha precisa ter pelo menos 6 caracteres'
        )

        return

      }

      if (!codigoLiberado) {

        alert(
          'Valide o código novamente'
        )

        setCodigoValido(false)

        return

      }

      setLoadingCriar(true)

      try {

        const loginLimpo =
          novoLogin
            .trim()
            .toLowerCase()
            .replace(/\s/g, '')

        const codigoLimpo =
          codigo.trim().toUpperCase()

        /* CHECK LOGIN */

        const {
          data: loginExiste,
          error: loginError
        } = await supabase
          .from('profiles')
          .select('login')
          .eq(
            'login',
            loginLimpo
          )
          .maybeSingle()

        if (loginError) {

          console.error(
            'Erro ao verificar login:',
            loginError
          )

          alert(
            `Erro ao verificar login: ${loginError.message}`
          )

          return

        }

        if (loginExiste) {

          alert(
            'Login já utilizado'
          )

          return

        }

        /* CONFERE CÓDIGO DE NOVO */

        const {
          data: codigoAtual,
          error: codigoAtualError
        } = await supabase
          .from('access_codes')
          .select('*')
          .eq(
            'id',
            codigoLiberado.id
          )
          .maybeSingle()

        if (
          codigoAtualError ||
          !codigoAtual
        ) {

          console.error(
            'Erro ao conferir código:',
            codigoAtualError
          )

          alert(
            codigoAtualError?.message ||
            'Erro ao conferir código'
          )

          return

        }

        const usedCount =
          Number(codigoAtual.used_count ?? 0)

        const maxUses =
          Number(codigoAtual.max_uses ?? 1)

        if (
          codigoAtual.is_active === false ||
          codigoAtual.used === true ||
          usedCount >= maxUses
        ) {

          alert(
            'Este código não está mais disponível'
          )

          setCodigoValido(false)

          setCodigoLiberado(null)

          return

        }

        /* SIGNUP */

        const email =
          `${loginLimpo}@bolao.com`

        const {
          data,
          error
        } =
          await supabase.auth
            .signUp({

              email,
              password:
                novaSenha,
              options: {
                data: {
                  nome:
                    nome.trim().toUpperCase(),
                  iniciais:
                    iniciais.trim().toUpperCase(),
                  login:
                    loginLimpo,
                  access_code:
                    codigoLimpo
                }
              }

            })

        if (
          error ||
          !data.user
        ) {

          console.error(
            'Erro ao criar usuário:',
            error
          )

          alert(
            error?.message ||
            'Erro ao criar conta'
          )

          return

        }

        /* PROFILE */

        const {
          error: profileError
        } = await supabase
          .from('profiles')
          .insert({

            id:
              data.user.id,

            nome:
              nome.trim().toUpperCase(),

            iniciais:
              iniciais
                .trim()
                .toUpperCase(),

            login:
              loginLimpo,

            pontos: 0,

            cravadas: 0

          })

        if (profileError) {

          console.error(
            'Erro ao criar perfil:',
            profileError
          )

          alert(
            `Conta criada, mas houve erro ao criar o perfil: ${profileError.message}`
          )

          return

        }

        /* USED CODE */

        const {
          error: usedCodeError
        } = await supabase
          .from('access_codes')
          .update({
            used: true,
            used_count:
              usedCount + 1
          })
          .eq(
            'id',
            codigoAtual.id
          )

        if (usedCodeError) {

          console.error(
            'Erro ao atualizar código:',
            usedCodeError
          )

          alert(
            `Conta criada, mas houve erro ao marcar código como usado: ${usedCodeError.message}`
          )

          return

        }

        if (data.session) {

          alert(
            'Conta criada!'
          )

          router.push('/')

          return

        }

        alert(
          'Conta criada, mas ainda nao foi possivel entrar automaticamente. ' +
          'No Supabase, desative a confirmacao de e-mail para usar login por usuario e senha sem e-mail real.'
        )

        setCodigoValido(false)
        setCodigoLiberado(null)
        setPrimeiroAcesso(false)
        setCodigo('')
        setLogin(loginLimpo)
        setPassword('')

      } catch (error) {

        console.error(
          'Erro inesperado ao criar conta:',
          error
        )

        alert(
          'Erro inesperado ao criar conta'
        )

      } finally {

        setLoadingCriar(false)

      }

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

      <form
        onSubmit={async (e) => {
          e.preventDefault()

          if (!codigoValido) {
            await entrar()
          }
        }}
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
              type='submit'

              disabled={loadingLogin}

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

                cursor:
                  loadingLogin
                    ? 'not-allowed'
                    : 'pointer',

                opacity:
                  loadingLogin ? 0.75 : 1
              }}
            >
              {
                loadingLogin
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
                type="button"
                onClick={() =>
                  setPrimeiroAcesso(
                    !primeiroAcesso
                  )
                }
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#00ff9d',
                  cursor: 'pointer',
                  fontWeight: 'bold'
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
                      e.target.value.toUpperCase()
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      validarCodigo()
                    }
                  }}
                  placeholder="Digite o código"
                  style={{
                    width: '100%',
                    height: '56px',
                    borderRadius: '16px',
                    border:
                      '1px solid rgba(255,255,255,0.08)',
                    background:
                      'rgba(255,255,255,0.03)',
                    padding: '0 18px',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />

                <button
                  type="button"
                  onClick={
                    validarCodigo
                  }
                  disabled={loadingCodigo}
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

                    cursor:
                      loadingCodigo
                        ? 'not-allowed'
                        : 'pointer',

                    opacity:
                      loadingCodigo ? 0.75 : 1
                  }}
                >
                  {
                    loadingCodigo
                      ? 'Validando...'
                      : 'Continuar'
                  }
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
              type="button"
              onClick={
                criarConta
              }
              disabled={loadingCriar}
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

                cursor:
                  loadingCriar
                    ? 'not-allowed'
                    : 'pointer',

                opacity:
                  loadingCriar ? 0.75 : 1
              }}
            >
              {
                loadingCriar
                  ? 'Criando...'
                  : 'Criar conta'
              }
            </button>

            <button
              type="button"
              onClick={() => {
                setCodigoValido(false)
                setCodigoLiberado(null)
              }}
              disabled={loadingCriar}
              style={{
                width: '100%',
                marginTop: '16px',
                background: 'transparent',
                border: 'none',
                color: '#00ff9d',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Voltar
            </button>

          </div>

        )}

      </form>

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
