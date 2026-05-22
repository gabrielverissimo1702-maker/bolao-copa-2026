'use client'

import { useEffect, useState } from 'react'

import Navbar from '../components/Navbar'

import { supabase } from '../../lib/supabase'

export default function RankingPage() {

  const [ranking, setRanking] =
    useState<any[]>([])

  const [perfil, setPerfil] =
    useState<any>(null)

  const [mobile, setMobile] =
    useState(false)

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

        const { data: authData } =
          await supabase.auth.getUser()

        if (!authData.user)
          return

        const user =
          authData.user

        /* PERFIL */

        const { data: perfilData } =
          await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (perfilData)
          setPerfil(perfilData)

        /* RANKING */

        const { data: rankingData } =
          await supabase
            .from('profiles')
            .select('*')
            .order('pontos', {
              ascending: false
            })

        if (rankingData)
          setRanking(rankingData)

      }

    carregar()

    return () => {

      window.removeEventListener(
        'resize',
        checkMobile
      )

    }

  }, [])

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
                  ? '50px'
                  : '74px',

              lineHeight: 0.9,

              marginBottom: '12px'
            }}
          >
            CLASSIFICAÇÃO{' '}

            <span
              style={{
                color: '#00ff9d'
              }}
            >
              GERAL
            </span>

          </h1>

          <p
            style={{
              opacity: 0.7,

              maxWidth: '520px',

              lineHeight: 1.5
            }}
          >
            Acompanhe seu desempenho e a disputa
            pela premiação.
          </p>

        </section>

        {/* TABELA */}

        <section
          style={{
            maxWidth: '820px',

            margin: '0 auto',

            overflow: 'hidden'
          }}
        >

          {/* HEADER */}

          <div
            style={{
              display: 'grid',

              gridTemplateColumns:
                mobile
                  ? '32px minmax(0,1fr) 52px 52px'
                  : '60px 1fr 120px 120px',

              padding:
                mobile
                  ? '10px 12px'
                  : '12px 18px',

              opacity: 0.4,

              fontSize:
                mobile
                  ? '9px'
                  : '10px',

              textTransform:
                'uppercase',

              marginBottom: '8px',

              width: '100%',

              boxSizing:
                'border-box'
            }}
          >

            <div>Pos</div>

            <div>Jogador</div>

            <div
              style={{
                textAlign: 'center'
              }}
            >
              Pts
            </div>

            <div
              style={{
                textAlign: 'center'
              }}
            >
              Crav
            </div>

          </div>

          {/* LISTA */}

          <div
            style={{
              display: 'flex',

              flexDirection: 'column',

              gap: '8px'
            }}
          >

            {ranking.map(
              (
                user: any,
                index: number
              ) => {

              const eu =
                perfil?.id === user.id

              return (

                <div
                  key={user.id}

                  style={{
                    display: 'grid',

                    gridTemplateColumns:
                      mobile
                        ? '32px minmax(0,1fr) 52px 52px'
                        : '60px 1fr 120px 120px',

                    alignItems: 'center',

                    minHeight:
                      mobile
                        ? '58px'
                        : '72px',

                    padding:
                      mobile
                        ? '0 12px'
                        : '0 18px',

                    borderRadius:
                      '14px',

                    background:
                      eu
                        ? 'rgba(0,255,157,0.08)'
                        : 'rgba(255,255,255,0.03)',

                    border:
                      eu
                        ? '1px solid rgba(0,255,157,0.25)'
                        : '1px solid rgba(255,255,255,0.06)',

                    boxShadow:
                      eu
                        ? '0 0 24px rgba(0,255,157,0.08)'
                        : 'none',

                    backdropFilter:
                      'blur(20px)',

                    overflow: 'hidden',

                    width: '100%',

                    boxSizing:
                      'border-box'
                  }}
                >

                  {/* POS */}

                  <div
                    style={{
                      fontSize:
                        mobile
                          ? '18px'
                          : '22px',

                      fontWeight: 'bold',

                      color:
                        index === 0
                          ? '#ffc400'
                          : index === 1
                          ? '#d9d9d9'
                          : index === 2
                          ? '#cd7f32'
                          : '#00ff9d'
                    }}
                  >
                    {index + 1}
                  </div>

                  {/* USER */}

                  <div
                    style={{
                      display: 'flex',

                      alignItems: 'center',

                      gap:
                        mobile
                          ? '6px'
                          : '12px',

                      minWidth: 0,

                      overflow: 'hidden'
                    }}
                  >

                    {/* INICIAIS */}

                    <div
                      style={{
                        width:
                          mobile
                            ? '24px'
                            : '32px',

                        height:
                          mobile
                            ? '24px'
                            : '32px',

                        minWidth:
                          mobile
                            ? '24px'
                            : '32px',

                        borderRadius:
                          '999px',

                        background:
                          'rgba(0,255,157,0.1)',

                        border:
                          '1px solid rgba(0,255,157,0.18)',

                        display: 'flex',

                        alignItems: 'center',

                        justifyContent: 'center',

                        color: '#00ff9d',

                        fontWeight: 'bold',

                        fontSize:
                          mobile
                            ? '10px'
                            : '12px',

                        flexShrink: 0
                      }}
                    >
                      {user.iniciais}
                    </div>

                    {/* NOME */}

                    <div
                      style={{
                        overflow: 'hidden',

                        minWidth: 0,

                        flex: 1
                      }}
                    >

                      <p
                        style={{
                          fontSize:
                            mobile
                              ? '15px'
                              : '22px',

                          fontWeight: 'bold',

                          whiteSpace:
                            'nowrap',

                          overflow:
                            'hidden',

                          textOverflow:
                            'ellipsis'
                        }}
                      >
                        {user.nome}
                      </p>

                    </div>

                  </div>

                  {/* PTS */}

                  <div
                    style={{
                      textAlign: 'center',

                      fontSize:
                        mobile
                          ? '16px'
                          : '26px',

                      fontWeight: 'bold',

                      color: '#00ff9d',

                      flexShrink: 0
                    }}
                  >
                    {user.pontos}
                  </div>

                  {/* CRAV */}

                  <div
                    style={{
                      textAlign: 'center',

                      fontSize:
                        mobile
                          ? '16px'
                          : '26px',

                      fontWeight: 'bold',

                      color: '#ffc400',

                      flexShrink: 0
                    }}
                  >
                    {user.cravadas}
                  </div>

                </div>

              )

            })}

          </div>

        </section>

      </main>

    </>

  )

}