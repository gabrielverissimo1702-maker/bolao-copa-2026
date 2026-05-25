'use client'

import { useEffect, useState } from 'react'

import Navbar from '../components/Navbar'

import { supabase } from '../../lib/supabase'

import { useRouter } from 'next/navigation'
import { LogIn, User } from 'lucide-react'

export default function PerfilPage() {

  const router = useRouter()

  const [mobile, setMobile] =
    useState(false)

  const [loading, setLoading] =
    useState(false)

  const [perfil, setPerfil] =
    useState<any>(null)

  const [nome, setNome] =
    useState('')

  const [iniciais, setIniciais] =
    useState('')

  const [login, setLogin] =
    useState ('')

  const [posicao, setPosicao] =
    useState<number>(0)

  useEffect(() => {

    const checkMobile = () => {

      setMobile(
        window.innerWidth <= 900
      )

    }

    checkMobile()

    window.addEventListener(
      'resize',
      checkMobile
    )

    const carregar =
      async () => {

        const {
          data: authData
        } =
          await supabase.auth.getUser()

        if (!authData.user) {

          router.replace('/login')

          return

        }

        const user =
          authData.user

        /* PERFIL */

        const {
          data: perfilData
        } =
          await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (perfilData) {

          setPerfil(perfilData)

          setNome(
            perfilData.nome || ''
          )

          setIniciais(
            perfilData.iniciais || ''
          )

          setLogin(
  perfilData.login || ''
)

        }

        /* RANKING */

        const {
          data: rankingData
        } =
          await supabase
            .from('profiles')
            .select('id')
            .order('pontos', {
              ascending: false
            })

        if (rankingData) {

          const minhaPosicao =
            rankingData.findIndex(
              (u: any) =>
                u.id === user.id
            ) + 1

          setPosicao(
            minhaPosicao
          )

        }

      }

    carregar()

    return () => {

      window.removeEventListener(
        'resize',
        checkMobile
      )

    }

  }, [])

  const salvar =
    async () => {

      if (!perfil)
        return

      setLoading(true)

      await supabase
        .from('profiles')
        .update({

          nome:
            nome
              .trim()
              .toUpperCase(),

          iniciais:
            iniciais
              .trim()
              .toUpperCase()

        })
        .eq(
          'id',
          perfil.id
        )

      setLoading(false)

      window.location.reload()

    }

  const sair =
    async () => {

      await supabase.auth.signOut()

      router.replace('/login')

    }

  return (

    <>

      <Navbar />

      <main
        style={{

          marginLeft:
            mobile
              ? 0
              : '110px',

          padding:
            mobile
              ? '18px 14px 120px'
              : '28px',

          color: 'white',

          minHeight: '100vh',

          overflowX: 'hidden',

          width:
            mobile
              ? '100vw'
              : 'calc(100vw - 110px)',

          maxWidth: '100%',

          boxSizing:
            'border-box'
        }}
      >

        {/* HERO */}

        <section
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
           BOLÃO COPA DO MUNDO FIFA 2026 
          </p>

          <h1
            className="fifa-title"

            style={{
              fontSize:
                mobile
                  ? '52px'
                  : '74px',

              lineHeight: 0.9,

              marginBottom: '12px'
            }}
          >
            MEU{' '}

            <span
              style={{
                color: '#00ff9d'
              }}
            >
              PERFIL
            </span>

          </h1>

          <p
            style={{
              opacity: 0.7,

              maxWidth: '520px',

              lineHeight: 1.5
            }}
          >
            Atualize suas informações
            e acompanhe seus números
            no bolão.
          </p>

        </section>

        {/* CARD */}

        <section
          style={{
            maxWidth: '520px',

            margin: '0 auto'
          }}
        >

          <div
            style={{

              border:
                '1px solid rgba(0,255,157,0.25)',

              borderRadius: '20px',

              background:
                'rgba(0,0,0,0.45)',

              boxShadow:
                '0 0 30px rgba(0,255,157,0.06)',

              backdropFilter:
                'blur(20px)',

              padding:
                mobile
                  ? '24px 18px'
                  : '32px'
            }}
          >

            {/* AVATAR */}

            <div
              style={{
                display: 'flex',

                justifyContent:
                  'center',

                marginBottom: '18px'
              }}
            >

              <div
                style={{
                  width:
                    mobile
                      ? '92px'
                      : '120px',

                  height:
                    mobile
                      ? '92px'
                      : '120px',

                  borderRadius:
                    '999px',

                  background:
                    'rgba(0,255,157,0.08)',

                  border:
                    '1px solid rgba(0,255,157,0.25)',

                  display: 'flex',

                  alignItems: 'center',

                  justifyContent: 'center',

                  color: '#00ff9d',

                  fontWeight: 'bold',

                  fontSize:
                    mobile
                      ? '34px'
                      : '46px'
                }}
              >
                {
                  iniciais
                    ?.toUpperCase()
                }
              </div>

            </div>

            {/* NOME */}

            <div
              style={{
                textAlign: 'center',

                marginBottom: '24px'
              }}
            >

              <h2
                style={{
                  fontSize:
                    mobile
                      ? '24px'
                      : '30px',

                  fontWeight: 'bold',

                  marginBottom: '8px'
                }}
              >
                {nome || 'SEM NOME'}
              </h2>

            </div>

            {/* STATS */}

            <div
              style={{
                display: 'grid',

                gridTemplateColumns:
                  '1fr 1fr 1fr',

                gap: '10px',

                marginBottom: '26px'
              }}
            >

              {/* PTS */}

              <div
                style={{
                  border:
                    '1px solid rgba(255,255,255,0.06)',

                  background:
                    'rgba(255,255,255,0.03)',

                  borderRadius:
                    '14px',

                  padding:
                    '14px',

                  textAlign:
                    'center'
                }}
              >

                <p
                  style={{
                    opacity: 0.5,

                    fontSize: '10px',

                    marginBottom: '4px',

                    textTransform:
                      'uppercase'
                  }}
                >
                  Pontos
                </p>

                <p
                  style={{
                    fontSize:
                      mobile
                        ? '22px'
                        : '28px',

                    fontWeight:
                      'bold',

                    color:
                      '#00ff9d'
                  }}
                >
                  {
                    perfil?.pontos
                    ?? 0
                  }
                </p>

              </div>

              {/* CRAV */}

              <div
                style={{
                  border:
                    '1px solid rgba(255,255,255,0.06)',

                  background:
                    'rgba(255,255,255,0.03)',

                  borderRadius:
                    '14px',

                  padding:
                    '14px',

                  textAlign:
                    'center'
                }}
              >

                <p
                  style={{
                    opacity: 0.5,

                    fontSize: '10px',

                    marginBottom: '4px',

                    textTransform:
                      'uppercase'
                  }}
                >
                  Cravadas
                </p>

                <p
                  style={{
                    fontSize:
                      mobile
                        ? '22px'
                        : '28px',

                    fontWeight:
                      'bold',

                    color:
                      '#ffc400'
                  }}
                >
                  {
                    perfil?.cravadas
                    ?? 0
                  }
                </p>

              </div>

              {/* POS */}

              <div
                style={{
                  border:
                    '1px solid rgba(255,255,255,0.06)',

                  background:
                    'rgba(255,255,255,0.03)',

                  borderRadius:
                    '14px',

                  padding:
                    '14px',

                  textAlign:
                    'center'
                }}
              >

                <p
                  style={{
                    opacity: 0.6,

                    fontSize: '10px',

                    marginBottom: '4px',

                    textTransform:
                      'uppercase'
                  }}
                >
                  COLOCAÇÃO
                </p>

                <p
                  style={{
                    fontSize:
                      mobile
                        ? '22px'
                        : '28px',

                    fontWeight:
                      'bold',

                    color:
                      '#b76cff'
                  }}
                >
                  {posicao}°
                </p>

              </div>

            </div>

            {/* FORM */}

            <div
              style={{
                display: 'flex',

                flexDirection:
                  'column',

                gap: '16px'
              }}
            >


              {/* LOGIN */}

              <div>

                <p
                  style={{
                    fontSize: '11px',

                    opacity: 0.6,

                    marginBottom: '8px',

                    textTransform:
                      'uppercase'
                  }}
                >
                  LOGIN
                </p>

               <input
  value={login}

  readOnly

  style={{
    width: '100%',

    height: '52px',

    opacity: 0.6,

    borderRadius:
      '14px',

    border:
      '1px solid rgba(255,255,255,0.08)',

    background:
      'rgba(255,255,255,0.03)',

    color: 'white',

    padding:
      '0 16px',

    fontSize:
      '16px',

    outline:
      'none',

    boxSizing:
      'border-box'
  }}
/>
              </div>

              {/* NOME */}

              <div>

                <p
                  style={{
                    fontSize: '11px',

                    opacity: 0.6,

                    marginBottom: '8px',

                    textTransform:
                      'uppercase'
                  }}
                >
                  Nome
                </p>

                <input
                  value={nome}

                  readOnly

                  style={{
                    width: '100%',

                    height: '52px',

                    opacity: 0.5,

                    borderRadius:
                      '14px',

                    border:
                      '1px solid rgba(255,255,255,0.08)',

                    background:
                      'rgba(255,255,255,0.03)',

                    color: 'white',

                    padding:
                      '0 16px',

                    fontSize:
                      '16px',

                    outline:
                      'none',

                    boxSizing:
                      'border-box'
                  }}
                />

              </div>

              {/* INICIAIS */}

              <div>

                <p
                  style={{
                    fontSize: '11px',

                    opacity: 0.6,

                    marginBottom: '8px',

                    textTransform:
                      'uppercase'
                  }}
                >
                  Iniciais
                </p>

                <input
                  value={iniciais}

                  maxLength={3}

                  onChange={(e) =>
                    setIniciais(
                      e.target.value
                    )
                  }

                  style={{
                    width: '100%',

                    height: '52px',

                    borderRadius:
                      '14px',

                    border:
                      '1px solid rgba(255,255,255,0.08)',

                    background:
                      'rgba(255,255,255,0.03)',

                    color: 'white',

                    padding:
                      '0 16px',

                    fontSize:
                      '16px',

                    outline:
                      'none',

                    boxSizing:
                      'border-box'
                  }}
                />

              </div>

              {/* BTN */}

              <button
                onClick={salvar}

                disabled={loading}

                style={{
                  width: '100%',

                  height: '54px',

                  border: 'none',

                  borderRadius:
                    '14px',

                  background:
                    '#00ff9d',

                  color: 'black',

                  fontWeight:
                    'bold',

                  fontSize:
                    '15px',

                  cursor:
                    'pointer',

                  marginTop: '6px'
                }}
              >
                {
                  loading
                    ? 'SALVANDO...'
                    : 'SALVAR ALTERAÇÕES'
                }
              </button>

              {/* LOGOUT */}

              <button
                onClick={sair}

                style={{
                  width: '100%',

                  height: '52px',

                  borderRadius:
                    '14px',

                  border:
                    '1px solid rgba(255,80,80,0.25)',

                  background:
                    'rgba(255,80,80,0.08)',

                  color:
                    '#ff7070',

                  fontWeight:
                    'bold',

                  fontSize:
                    '14px',

                  cursor:
                    'pointer'
                }}
              >
                SAIR DA CONTA
              </button>

            </div>

          </div>

        </section>

      </main>

    </>

  )

}