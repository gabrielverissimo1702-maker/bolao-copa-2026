'use client'

import { useEffect, useState } from 'react'

import Navbar from '../components/Navbar'

import { supabase } from '../../lib/supabase'

export default function PlacaresPage() {

  const [games, setGames] =
    useState<any[]>([])

  const [bets, setBets] =
    useState<any[]>([])

  const [teams, setTeams] =
    useState<any[]>([])

  const [profiles, setProfiles] =
    useState<any[]>([])

  const [mobile, setMobile] =
    useState(false)

  const [pagina, setPagina] =
    useState(1)

  const [userId, setUserId] =
    useState<string | null>(null)

  const jogosPorPagina = 8

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

        if (authData.user)
          setUserId(authData.user.id)

        const { data: gamesData } =
          await supabase
            .from('games')
            .select('*')
            .order('match_date', {
              ascending: true
            })

        if (gamesData)
          setGames(gamesData)

        const { data: betsData } =
          await supabase
            .from('bets')
            .select('*')

        if (betsData)
          setBets(betsData)

        const { data: teamsData } =
          await supabase
            .from('teams')
            .select('*')

        if (teamsData)
          setTeams(teamsData)

        const { data: profilesData } =
          await supabase
            .from('profiles')
            .select('*')

        if (profilesData)
          setProfiles(profilesData)

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

  const getBets =
    (gameId: number) => {

      return bets.filter(
        (b: any) =>
          b.game_id === gameId
      )

    }

  const getProfile =
    (id: string) => {

      return profiles.find(
        (p: any) =>
          p.id === id
      )

    }

  const inicio =
    (pagina - 1) * jogosPorPagina

  const fim =
    inicio + jogosPorPagina

  const jogosPagina =
    games.slice(inicio, fim)

  const totalPaginas =
    Math.ceil(
      games.length / jogosPorPagina
    )

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

          color: 'white',

          minHeight: '100vh'
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
              letterSpacing: '0.28em',
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
                  ? '46px'
                  : '72px',

              lineHeight: 0.9,

              marginBottom: '12px'
            }}
          >
            CENTRAL{' '}

            <span
              style={{
                color: '#00ff9d'
              }}
            >
              DE PLACARES
            </span>

          </h1>

          <p
            style={{
              opacity: 0.7,
              maxWidth: '520px',
              lineHeight: 1.5
            }}
          >
            Veja os palpites
            de todos os jogadores
            em tempo real.
          </p>

        </section>

        {/* PAGINAÇÃO */}

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',

            gap: '8px',

            marginBottom: '20px',

            flexWrap: 'wrap'
          }}
        >

          {Array.from({
            length: totalPaginas
          }).map((_, index) => (

            <button
              key={index}

              onClick={() =>
                setPagina(index + 1)
              }

              style={{
                width: '42px',
                height: '42px',

                borderRadius: '12px',

                border:
                  pagina === index + 1
                    ? '1px solid #00ff9d'
                    : '1px solid rgba(255,255,255,0.08)',

                background:
                  pagina === index + 1
                    ? 'rgba(0,255,157,0.12)'
                    : 'rgba(255,255,255,0.03)',

                color:
                  pagina === index + 1
                    ? '#00ff9d'
                    : 'white',

                fontWeight: 'bold',

                cursor: 'pointer'
              }}
            >
              {index + 1}
            </button>

          ))}

        </div>

        {/* LISTA */}

        <section
          style={{
            display: 'flex',
            flexDirection: 'column',

            gap: '18px',

            maxWidth: '760px',

            margin: '0 auto'
          }}
        >

          {jogosPagina.map(
            (game: any) => {

            const home =
              getTeam(
                game.home_team
              )

            const away =
              getTeam(
                game.away_team
              )

            const agora =
              new Date().getTime()

            const horarioJogo =
              new Date(
                game.match_date
              ).getTime()

            const liberar =
              agora >= horarioJogo

            const palpites =
              getBets(game.id)

            const meuPalpite =
              palpites.find(
                (b: any) =>
                  b.user_id === userId
              )

            return (

              <div
                key={game.id}

                style={{
                  border:
                    '1px solid rgba(0,255,157,0.18)',

                  background:
                    'rgba(0,0,0,0.45)',

                  boxShadow:
                    '0 0 30px rgba(0,255,157,0.06)',

                  borderRadius: '20px',

                  overflow: 'hidden'
                }}
              >

                {/* TOPO */}

                <div
                  style={{
                    padding:
                      mobile
                        ? '22px 14px'
                        : '24px'
                  }}
                >

                  {/* JOGO */}

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                  >

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',

                        gap:
                          mobile
                            ? '10px'
                            : '18px',

                        width: '100%'
                      }}
                    >

                      {/* HOME */}

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',

                          gap: '8px',

                          minWidth:
                            mobile
                              ? '90px'
                              : '130px',

                          justifyContent: 'flex-end'
                        }}
                      >

                        <p
                          style={{
                            fontSize:
                              mobile
                                ? '20px'
                                : '28px',

                            fontWeight: 'bold'
                          }}
                        >
                          {home?.nome}
                        </p>

                        <img
                          src={`https://flagcdn.com/w80/${home?.flag}.png`}
                          alt=""

                          style={{
                            width:
                              mobile
                                ? '30px'
                                : '38px',

                            height:
                              mobile
                                ? '30px'
                                : '38px',

                            borderRadius:
                              '999px',

                            objectFit:
                              'cover'
                          }}
                        />

                      </div>

                      {/* SCORE */}

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',

                          gap: '8px'
                        }}
                      >

                        <div
                          style={{
                            width:
                              mobile
                                ? '42px'
                                : '48px',

                            height:
                              mobile
                                ? '42px'
                                : '48px',

                            borderRadius:
                              '12px',

                            border:
                              '1px solid rgba(255,255,255,0.08)',

                            background:
                              'rgba(255,255,255,0.03)',

                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',

                            fontSize:
                              mobile
                                ? '24px'
                                : '28px',

                            fontWeight: 'bold'
                          }}
                        >
                          {game.home_score ?? '-'}
                        </div>

                        <span
                          style={{
                            opacity: 0.5
                          }}
                        >
                          x
                        </span>

                        <div
                          style={{
                            width:
                              mobile
                                ? '42px'
                                : '48px',

                            height:
                              mobile
                                ? '42px'
                                : '48px',

                            borderRadius:
                              '12px',

                            border:
                              '1px solid rgba(255,255,255,0.08)',

                            background:
                              'rgba(255,255,255,0.03)',

                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',

                            fontSize:
                              mobile
                                ? '24px'
                                : '28px',

                            fontWeight: 'bold'
                          }}
                        >
                          {game.away_score ?? '-'}
                        </div>

                      </div>

                      {/* AWAY */}

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',

                          gap: '8px',

                          minWidth:
                            mobile
                              ? '90px'
                              : '130px'
                        }}
                      >

                        <img
                          src={`https://flagcdn.com/w80/${away?.flag}.png`}
                          alt=""

                          style={{
                            width:
                              mobile
                                ? '30px'
                                : '38px',

                            height:
                              mobile
                                ? '30px'
                                : '38px',

                            borderRadius:
                              '999px',

                            objectFit:
                              'cover'
                          }}
                        />

                        <p
                          style={{
                            fontSize:
                              mobile
                                ? '20px'
                                : '28px',

                            fontWeight: 'bold'
                          }}
                        >
                          {away?.nome}
                        </p>

                      </div>

                    </div>

                    {/* DATA */}

                    <div
                      style={{
                        marginTop: '12px',

                        fontSize: '11px',

                        opacity: 0.6
                      }}
                    >
                      {
                        new Date(
                          game.match_date
                        ).toLocaleDateString(
                          'pt-BR',
                          {
                            day: '2-digit',
                            month: '2-digit'
                          }
                        )
                      }

                      {' • '}

                      {
                        new Date(
                          game.match_date
                        ).toLocaleTimeString(
                          'pt-BR',
                          {
                            hour: '2-digit',
                            minute: '2-digit'
                          }
                        )
                      }
                    </div>

                  </div>

                </div>

                {/* PALPITES */}

                {liberar && (

                  <div
                    style={{
                      borderTop:
                        '1px solid rgba(255,255,255,0.06)',

                      padding:
                        mobile
                          ? '18px 12px'
                          : '22px'
                    }}
                  >

                    {/* MEU PALPITE */}

                    {meuPalpite && (

                      <div
                        style={{
                          marginBottom: '22px'
                        }}
                      >

                        <p
                          style={{
                            textAlign: 'center',

                            fontSize: '11px',

                            letterSpacing:
                              '0.08em',

                            opacity: 0.55,

                            marginBottom: '14px',

                            textTransform:
                              'uppercase'
                          }}
                        >
                          Meu palpite
                        </p>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',

                            gap: '10px',

                            marginBottom: '14px'
                          }}
                        >

                          <div
                            style={{
                              width: '28px',
                              height: '28px',

                              borderRadius:
                                '999px',

                              background:
                                'rgba(0,255,157,0.1)',

                              border:
                                '1px solid rgba(0,255,157,0.2)',

                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',

                              color: '#00ff9d',

                              fontWeight: 'bold',

                              fontSize: '11px'
                            }}
                          >
                            {
                              getProfile(
                                meuPalpite.user_id
                              )?.iniciais
                            }
                          </div>

                          <div
                            style={{
                              fontSize: '14px',

                              fontWeight: 'bold'
                            }}
                          >
                            {
                              getProfile(
                                meuPalpite.user_id
                              )?.nome
                            }
                          </div>

                        </div>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',

                            gap: '8px'
                          }}
                        >

                          <div
                            style={{
                              width:
                                mobile
                                  ? '42px'
                                  : '48px',

                              height:
                                mobile
                                  ? '42px'
                                  : '48px',

                              borderRadius:
                                '12px',

                              border:
                                '1px solid #00ff9d',

                              background:
                                'rgba(0,255,157,0.1)',

                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',

                              fontSize:
                                mobile
                                  ? '24px'
                                  : '28px',

                              fontWeight: 'bold',

                              color: '#00ff9d'
                            }}
                          >
                            {meuPalpite.home_guess}
                          </div>

                          <span
                            style={{
                              opacity: 0.5
                            }}
                          >
                            x
                          </span>

                          <div
                            style={{
                              width:
                                mobile
                                  ? '42px'
                                  : '48px',

                              height:
                                mobile
                                  ? '42px'
                                  : '48px',

                              borderRadius:
                                '12px',

                              border:
                                '1px solid #00ff9d',

                              background:
                                'rgba(0,255,157,0.1)',

                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',

                              fontSize:
                                mobile
                                  ? '24px'
                                  : '28px',

                              fontWeight: 'bold',

                              color: '#00ff9d'
                            }}
                          >
                            {meuPalpite.away_guess}
                          </div>

                        </div>

                      </div>

                    )}

                    {/* ADVERSÁRIOS */}

                    <p
                      style={{
                        textAlign: 'center',

                        fontSize: '11px',

                        letterSpacing:
                          '0.08em',

                        opacity: 0.55,

                        marginBottom: '14px',

                        textTransform:
                          'uppercase'
                      }}
                    >
                      Palpites da rodada
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',

                        justifyContent: 'center',

                        gap: '10px'
                      }}
                    >

                      {palpites
                        .filter(
                          (b: any) =>
                            b.user_id !== userId
                        )
                        .map(
                          (
                            bet: any,
                            index: number
                          ) => {

                          const nome =
                            getProfile(
                              bet.user_id
                            )?.nome

                          return (

                            <div
                              key={index}

                              style={{
                                width:
                                  mobile
                                    ? '100%'
                                    : '220px',

                                borderRadius:
                                  '14px',

                                padding:
                                  '14px 12px',

                                background:
                                  'rgba(255,255,255,0.03)',

                                border:
                                  '1px solid rgba(255,255,255,0.05)'
                              }}
                            >

                              {/* NOME */}

                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',

                                  gap: '10px',

                                  marginBottom: '12px'
                                }}
                              >

                                <div
                                  style={{
                                    width: '28px',
                                    height: '28px',

                                    borderRadius:
                                      '999px',

                                    background:
                                      'rgba(0,255,157,0.1)',

                                    border:
                                      '1px solid rgba(0,255,157,0.2)',

                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',

                                    color: '#00ff9d',

                                    fontWeight: 'bold',

                                    fontSize: '11px'
                                  }}
                                >
                                  {
                                    getProfile(
                                      bet.user_id
                                    )?.iniciais
                                  }
                                </div>

                                <div
                                  style={{
                                    fontSize: '14px',

                                    fontWeight: 'bold'
                                  }}
                                >
                                  {nome}
                                </div>

                              </div>

                              {/* SCORE */}

                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',

                                  gap: '6px'
                                }}
                              >

                                <div
                                  style={{
                                    width: '36px',
                                    height: '36px',

                                    borderRadius:
                                      '10px',

                                    border:
                                      '1px solid rgba(255,255,255,0.08)',

                                    background:
                                      'rgba(255,255,255,0.03)',

                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',

                                    fontSize: '20px',

                                    fontWeight: 'bold'
                                  }}
                                >
                                  {bet.home_guess}
                                </div>

                                <span
                                  style={{
                                    opacity: 0.5
                                  }}
                                >
                                  x
                                </span>

                                <div
                                  style={{
                                    width: '36px',
                                    height: '36px',

                                    borderRadius:
                                      '10px',

                                    border:
                                      '1px solid rgba(255,255,255,0.08)',

                                    background:
                                      'rgba(255,255,255,0.03)',

                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',

                                    fontSize: '20px',

                                    fontWeight: 'bold'
                                  }}
                                >
                                  {bet.away_guess}
                                </div>

                              </div>

                            </div>

                          )

                        })}

                    </div>

                  </div>

                )}

              </div>

            )

          })}

        </section>
{/* PAGINAÇÃO BAIXO */}

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',

            gap: '8px',

            marginTop: '24px',

            flexWrap: 'wrap'
          }}
        >

          {Array.from({
            length: totalPaginas
          }).map((_, index) => (

            <button
              key={index}

              onClick={() =>
                setPagina(index + 1)
              }

              style={{
                width: '42px',
                height: '42px',

                borderRadius: '12px',

                border:
                  pagina === index + 1
                    ? '1px solid #00ff9d'
                    : '1px solid rgba(255,255,255,0.08)',

                background:
                  pagina === index + 1
                    ? 'rgba(0,255,157,0.12)'
                    : 'rgba(255,255,255,0.03)',

                color:
                  pagina === index + 1
                    ? '#00ff9d'
                    : 'white',

                fontWeight: 'bold',

                cursor: 'pointer'
              }}
            >
              {index + 1}
            </button>

          ))}

        </div>

      </main>

    </>

  )

}