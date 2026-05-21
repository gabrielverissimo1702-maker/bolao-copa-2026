'use client'

import { useEffect, useState } from 'react'

import Navbar from './components/Navbar'

import { supabase } from '../lib/supabase'

import { useRouter } from 'next/navigation'

export default function HomePage() {

  const router = useRouter()

  const [perfil, setPerfil] =
    useState<any>(null)

  const [ranking, setRanking] =
    useState<any[]>([])

  const [games, setGames] =
    useState<any[]>([])

  const [bets, setBets] =
    useState<any[]>([])

  const [teams, setTeams] =
    useState<any[]>([])

  const [minhaPosicao, setMinhaPosicao] =
    useState<number>(0)

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

        if (perfilData)
          setPerfil(perfilData)

        /* RANKING */

        const {
          data: rankingData
        } =
          await supabase
            .from('profiles')
            .select('*')
            .order('pontos', {
              ascending: false
            })

        if (rankingData) {

          setRanking(rankingData)

          const posicao =
            rankingData.findIndex(
              (u: any) =>
                u.id === user.id
            ) + 1

          setMinhaPosicao(posicao)

        }

        /* GAMES */

        const {
          data: gamesData
        } =
          await supabase
            .from('games')
            .select('*')
            .order('match_date', {
              ascending: true
            })
            .limit(4)

        if (gamesData)
          setGames(gamesData)

        /* BETS */

        const {
          data: betsData
        } =
          await supabase
            .from('bets')
            .select('*')
            .eq('user_id', user.id)

        if (betsData)
          setBets(betsData)

        /* TEAMS */

        const {
          data: teamsData
        } =
          await supabase
            .from('teams')
            .select('*')

        if (teamsData)
          setTeams(teamsData)

      }

    carregar()

    return () => {

      window.removeEventListener(
        'resize',
        checkMobile
      )

    }

  }, [])

  const getTeam =
    (sigla: string) => {

      return teams.find(
        (t: any) =>
          t.nome === sigla
      )

    }

  const getBet =
    (gameId: number) => {

      return bets.find(
        (b: any) =>
          b.game_id === gameId
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

          minHeight: '100vh',

          padding:
            mobile
              ? '18px'
              : '28px',

          color: 'white',

          overflowX: 'hidden',

          width: '100%',

          boxSizing:
            'border-box'
        }}
      >

        {/* GRID */}

        <section
          style={{
            display: 'grid',

            gridTemplateColumns:
              mobile
                ? '1fr'
                : '0.85fr 1.15fr',

            gap: '24px',

            alignItems: 'start',

            width: '100%',

            overflow: 'hidden'
          }}
        >

          {/* ESQUERDA */}

          <div
            style={{
              minWidth: 0
            }}
          >

            {/* HERO */}

            <section
              style={{
                marginBottom: '22px'
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
                  fontSize:
                    mobile
                      ? '52px'
                      : '72px',

                  lineHeight: 0.88,

                  marginBottom: '10px'
                }}
              >
                BOLÃO
                <br />

                <span
                  style={{
                    color: '#00ff9d'
                  }}
                >
                  OFICIAL
                </span>

              </h1>

              <p
                style={{
                  fontSize: '16px',

                  opacity: 0.7,

                  maxWidth: '430px',

                  lineHeight: 1.4
                }}
              >
                Faça seus palpites,
                dispute posições no ranking
                e compare com seus adversários.
              </p>

            </section>

            {/* DESEMPENHO */}

            <h2
              className="fifa-title"

              style={{
                fontSize: '34px',

                textAlign: 'center',

                marginBottom: '14px'
              }}
            >
              MEU{' '}

              <span
                style={{
                  color: '#b76cff'
                }}
              >
                DESEMPENHO
              </span>

            </h2>

            {/* STATUS */}

            <div
              style={{

                border:
                  '1px solid rgba(0,255,157,0.18)',

                background:
                  'rgba(0,0,0,0.45)',

                boxShadow:
                  '0 0 30px rgba(0,255,157,0.06)',

                borderRadius: '16px',

                padding:
                  mobile
                    ? '12px'
                    : '14px 18px',

                marginBottom: '22px',

                display: 'flex',

                alignItems: 'center',

                justifyContent:
                  'space-between',

                gap: '10px'
              }}
            >

              {/* POS */}

              <div
                style={{
                  flex: 1
                }}
              >

                <p
                  style={{
                    color: '#b76cff',

                    fontSize: '10px',

                    marginBottom: '4px',

                    textTransform:
                      'uppercase'
                  }}
                >
                  Colocação
                </p>

                <p
                  style={{
                    fontSize:
                      mobile
                        ? '18px'
                        : '26px',

                    fontWeight: 'bold'
                  }}
                >
                  {minhaPosicao}°
                </p>

              </div>

              <div
                style={{
                  width: '1px',

                  height: '44px',

                  background:
                    'rgba(255,255,255,0.08)'
                }}
              />

              {/* PTS */}

              <div
                style={{
                  flex: 1
                }}
              >

                <p
                  style={{
                    color: '#00ff9d',

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
                        ? '18px'
                        : '26px',

                    fontWeight: 'bold'
                  }}
                >
                  {perfil?.pontos ?? 0}
                </p>

              </div>

              <div
                style={{
                  width: '1px',

                  height: '44px',

                  background:
                    'rgba(255,255,255,0.08)'
                }}
              />

              {/* CRAV */}

              <div
                style={{
                  flex: 1
                }}
              >

                <p
                  style={{
                    color: '#ffc400',

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
                        ? '18px'
                        : '26px',

                    fontWeight: 'bold'
                  }}
                >
                  {perfil?.cravadas ?? 0}
                </p>

              </div>

            </div>

            {/* TOP 3 */}

            <h2
              className="fifa-title"

              style={{
                fontSize: '34px',

                textAlign: 'center',

                marginBottom: '14px'
              }}
            >
              TOP{' '}

              <span
                style={{
                  color: '#ffc400'
                }}
              >
                3
              </span>

            </h2>

            <section
              style={{
                width: '100%',

                overflow: 'hidden'
              }}
            >

              {/* HEADER */}

              <div
                style={{
                  display: 'grid',

                  gridTemplateColumns:
                    mobile
                      ? '36px minmax(0,1fr) 44px 44px'
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

                  flexDirection:
                    'column',

                  gap: '8px',

                  width: '100%'
                }}
              >

                {ranking
                  .slice(0, 3)
                  .map(
                    (
                      user: any,
                      index: number
                    ) => {

                    const eu =
                      perfil?.id ===
                      user.id

                    return (

                      <div
                        key={user.id}

                        style={{
                          display: 'grid',

                          gridTemplateColumns:
                            mobile
                              ? '36px minmax(0,1fr) 44px 44px'
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

                            fontWeight:
                              'bold',

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

                            alignItems:
                              'center',

                            gap:
                              mobile
                                ? '8px'
                                : '14px',

                            overflow:
                              'hidden',

                            minWidth: 0
                          }}
                        >

                          {/* INICIAIS */}

                          <div
                            style={{
                              minWidth:
                                mobile
                                  ? '28px'
                                  : '32px',

                              width:
                                mobile
                                  ? '28px'
                                  : '32px',

                              height:
                                mobile
                                  ? '28px'
                                  : '32px',

                              borderRadius:
                                '999px',

                              background:
                                'rgba(0,255,157,0.1)',

                              border:
                                '1px solid rgba(0,255,157,0.18)',

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
                                mobile
                                  ? '11px'
                                  : '12px',

                              flexShrink: 0
                            }}
                          >
                            {
                              user.iniciais
                            }
                          </div>

                          {/* NOME */}

                          <div
                            style={{
                              overflow:
                                'hidden',

                              minWidth: 0
                            }}
                          >

                            <p
                              style={{
                                fontSize:
                                  mobile
                                    ? '14px'
                                    : '22px',

                                fontWeight:
                                  'bold',

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
                            textAlign:
                              'center',

                            fontSize:
                              mobile
                                ? '15px'
                                : '26px',

                            fontWeight:
                              'bold',

                            color:
                              '#00ff9d'
                          }}
                        >
                          {user.pontos}
                        </div>

                        {/* CRAV */}

                        <div
                          style={{
                            textAlign:
                              'center',

                            fontSize:
                              mobile
                                ? '15px'
                                : '26px',

                            fontWeight:
                              'bold',

                            color:
                              '#ffc400'
                          }}
                        >
                          {user.cravadas}
                        </div>

                      </div>

                    )

                  })}

              </div>

            </section>

          </div>

        </section>

        <br />
        <br />
        <br />

      </main>

    </>

  )

}