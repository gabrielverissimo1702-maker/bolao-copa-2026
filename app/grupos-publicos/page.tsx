'use client'

import { useEffect, useState } from 'react'

import Navbar from '../components/Navbar'

import { supabase } from '../../lib/supabase'

import { useRouter } from 'next/navigation'

export default function GruposPublicosPage() {

  const router = useRouter()

  const [mobile, setMobile] =
    useState(false)

  const [groups, setGroups] =
    useState<any>({})

  const [profiles, setProfiles] =
    useState<any[]>([])

  const [teams, setTeams] =
    useState<any[]>([])

  const [pagina, setPagina] =
    useState(0)

  const ordemGrupos = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L'
  ]

  const liberado =
    new Date().getTime() >=
    new Date(
      '2026-05-11T16:00:00'
    ).getTime()

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
          await supabase.auth
            .getUser()

        if (!authData.user) {

          router.replace(
            '/login'
          )

          return

        }

        /* GROUP PREDICTIONS */

        const {
          data: predictions
        } =
          await supabase
            .from(
              'group_predictions'
            )
            .select('*')

        /* PROFILES */

        const {
          data: profilesData
        } =
          await supabase
            .from('profiles')
            .select('*')

        /* TEAMS */

        const {
          data: teamsData
        } =
          await supabase
            .from('teams')
            .select('*')

        if (profilesData)
          setProfiles(
            profilesData
          )

        if (teamsData)
          setTeams(
            teamsData
          )

        /* ORGANIZAR */

        const agrupados: any = {}

        predictions?.forEach(
          (item: any) => {

            if (
              !agrupados[
                item.group_name
              ]
            ) {

              agrupados[
                item.group_name
              ] = []

            }

            agrupados[
              item.group_name
            ].push(item)

          }
        )

        setGroups(
          agrupados
        )

      }

    carregar()

    return () => {

      window.removeEventListener(
        'resize',
        checkMobile
      )

    }

  }, [])

  const grupoAtual =
    ordemGrupos[pagina]

  const palpites =
    groups[grupoAtual] || []

  const getProfile =
    (id: string) => {

      return profiles.find(
        (p: any) =>
          p.id === id
      )

    }

  const getTeam =
    (sigla: string) => {

      return teams.find(
        (t: any) =>
          t.nome === sigla
      )

    }

  const renderTeam =
    (
      sigla: string,
      posicao: number
    ) => {

      const team =
        getTeam(sigla)

      return (

        <div
          style={{
            display: 'flex',
            alignItems: 'center',

            gap: '10px',

            padding:
              '10px 12px',

            borderRadius:
              '12px',

            background:
              'rgba(255,255,255,0.03)',

            border:
              '1px solid rgba(255,255,255,0.05)'
          }}
        >

          <div
            style={{
              width: '26px',

              textAlign:
                'center',

              fontWeight:
                'bold',

              opacity: 0.6
            }}
          >
            {posicao}º
          </div>

          <img
            src={`https://flagcdn.com/w80/${team?.flag}.png`}

            alt=""

            style={{
              width: '28px',
              height: '28px',

              borderRadius:
                '999px',

              objectFit:
                'cover'
            }}
          />

          <div
            style={{
              fontWeight: 'bold'
            }}
          >
            {sigla}
          </div>

        </div>

      )

    }

  return (

    <>

      <Navbar />

      <main
        style={{
          marginLeft:
            mobile
              ? '0'
              : '110px',

          padding:
            mobile
              ? '18px'
              : '28px',

          paddingBottom:
            mobile
              ? '120px'
              : '40px',

          minHeight:
            '100vh',

          color: 'white'
        }}
      >

        {/* HERO */}

        <section
          style={{
            marginBottom:
              '30px'
          }}
        >

          <p
            style={{
              color:
                '#00ff9d',

              letterSpacing:
                '0.28em',

              fontSize:
                '10px',

              marginBottom:
                '10px'
            }}
          >
           BOLÃO COPA DO MUNDO FIFA 2026
          </p>

          <h1
            className="fifa-title"

            style={{
              fontSize:
                mobile
                  ? '44px'
                  : '72px',

              lineHeight:
                0.9,

              marginBottom:
                '12px'
            }}
          >
            CENTRAL{' '}

            <span
              style={{
                color:
                  '#00ff9d'
              }}
            >
              DOS GRUPOS
            </span>

          </h1>

          <p
            style={{
              opacity: 0.7,

              maxWidth:
                '520px',

              lineHeight:
                1.5
            }}
          >
            Veja como você e seus
            adversários acreditam
            que terminarão os
            grupos da copa.
          </p>

        </section>

        {/* BLOQUEIO */}

        {!liberado && (

          <div
            style={{
              border:
                '1px solid rgba(255,255,255,0.08)',

              background:
                'rgba(255,255,255,0.03)',

              borderRadius:
                '18px',

              padding:
                mobile
                  ? '22px'
                  : '30px',

              textAlign:
                'center',

              maxWidth:
                '700px',

              margin:
                '0 auto'
            }}
          >

            <h2
              style={{
                marginBottom:
                  '10px'
              }}
            >
              Palpites ainda ocultos
            </h2>

            <p
              style={{
                opacity: 0.7
              }}
            >
              Os grupos serão
              revelados após o
              início da Copa do
              Mundo.
            </p>

          </div>

        )}

        {liberado && (

          <>

            {/* PAGINAÇÃO */}

            <div
              style={{
                display: 'flex',

                justifyContent:
                  'center',

                gap: '8px',

                marginBottom:
                  '24px',

                flexWrap:
                  'wrap'
              }}
            >

              {ordemGrupos.map(
                (
                  grupo,
                  index
                ) => (

                  <button
                    key={grupo}

                    onClick={() =>
                      setPagina(index)
                    }

                    style={{
                      width:
                        mobile
                          ? '42px'
                          : '50px',

                      height:
                        mobile
                          ? '42px'
                          : '50px',

                      borderRadius:
                        '14px',

                      border:
                        pagina === index
                          ? '1px solid #00ff9d'
                          : '1px solid rgba(255,255,255,0.08)',

                      background:
                        pagina === index
                          ? 'rgba(0,255,157,0.12)'
                          : 'rgba(255,255,255,0.03)',

                      color:
                        pagina === index
                          ? '#00ff9d'
                          : 'white',

                      fontWeight:
                        'bold',

                      cursor:
                        'pointer'
                    }}
                  >
                    {grupo}
                  </button>

                )
              )}

            </div>

            {/* GRUPO */}

            <section
              style={{
                maxWidth:
                  '1100px',

                margin:
                  '0 auto'
              }}
            >

              {/* HEADER */}

              <div
                style={{
                  display: 'flex',

                  justifyContent:
                    'center',

                  marginBottom:
                    '20px'
                }}
              >

                <div
                  style={{
                    border:
                      '1px solid rgba(0,255,157,0.18)',

                    background:
                      'rgba(0,0,0,0.45)',

                    boxShadow:
                      '0 0 30px rgba(0,255,157,0.06)',

                    borderRadius:
                      '18px',

                    padding:
                      mobile
                        ? '16px 24px'
                        : '18px 34px'
                  }}
                >

                  <h2
                    style={{
                      fontSize:
                        mobile
                          ? '28px'
                          : '42px'
                    }}
                  >
                    GRUPO{' '}

                    <span
                      style={{
                        color:
                          '#00ff9d'
                      }}
                    >
                      {grupoAtual}
                    </span>

                  </h2>

                </div>

              </div>

              {/* CARDS */}

              <div
                style={{
                  display: 'grid',

                  gridTemplateColumns:
                    mobile
                      ? '1fr'
                      : 'repeat(auto-fit, minmax(280px, 1fr))',

                  gap: '18px'
                }}
              >

                {palpites.map(
                  (
                    item: any,
                    index: number
                  ) => {

                    const profile =
                      getProfile(
                        item.user_id
                      )

                    return (

                      <div
                        key={index}

                        style={{
                          border:
                            '1px solid rgba(0,255,157,0.18)',

                          background:
                            'rgba(0,0,0,0.45)',

                          boxShadow:
                            '0 0 30px rgba(0,255,157,0.06)',

                          borderRadius:
                            '20px',

                          padding:
                            mobile
                              ? '18px'
                              : '22px'
                        }}
                      >

                        {/* USER */}

                        <div
                          style={{
                            display: 'flex',

                            alignItems:
                              'center',

                            justifyContent:
                              'center',

                            gap: '10px',

                            marginBottom:
                              '18px'
                          }}
                        >

                          <div
                            style={{
                              width:
                                '34px',

                              height:
                                '34px',

                              borderRadius:
                                '999px',

                              background:
                                'rgba(0,255,157,0.1)',

                              border:
                                '1px solid rgba(0,255,157,0.2)',

                              display:
                                'flex',

                              alignItems:
                                'center',

                              justifyContent:
                                'center',

                              color:
                                '#00ff9d',

                              fontWeight:
                                'bold',

                              fontSize:
                                '12px'
                            }}
                          >
                            {
                              profile
                                ?.iniciais
                            }
                          </div>

                          <div
                            style={{
                              fontWeight:
                                'bold',

                              fontSize:
                                '15px'
                            }}
                          >
                            {
                              profile
                                ?.nome
                            }
                          </div>

                        </div>

                        {/* POSIÇÕES */}

                        <div
                          style={{
                            display: 'flex',

                            flexDirection:
                              'column',

                            gap: '10px'
                          }}
                        >

                          {
                            renderTeam(
                              item.first_place,
                              1
                            )
                          }

                          {
                            renderTeam(
                              item.second_place,
                              2
                            )
                          }

                          {
                            renderTeam(
                              item.third_place,
                              3
                            )
                          }

                          {
                            renderTeam(
                              item.fourth_place,
                              4
                            )
                          }

                        </div>

                      </div>

                    )

                  }
                )}

              </div>

            </section>

          </>

        )}

      </main>

    </>

  )

}