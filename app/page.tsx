'use client'

import { useEffect, useState } from 'react'

import Navbar from './components/Navbar'

import { supabase } from '../lib/supabase'
import {
  calcularTotalPontosGrupos,
  deduplicarPredicoesGrupos
} from '../lib/grupos'
import {
  calcularCravadasUsuario
} from '../lib/jogos'
import {
  buscarTodosPalpites
} from '../lib/bets'

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

          const {
            data: predictions
          } =
            await supabase
              .from('group_predictions')
              .select('*')

          const {
            data: results
          } =
            await supabase
              .from('group_results')
              .select('*')

          const allBets =
            await buscarTodosPalpites()

          const {
            data: allGames
          } =
            await supabase
              .from('games')
              .select('*')

          const resultsByGroup: Record<string, any> = {}

          results?.forEach(
            (result: any) => {
              resultsByGroup[
                result.group_name
              ] = result
            }
          )

          const gamesById: Record<number, any> = {}

          allGames?.forEach(
            (game: any) => {
              gamesById[game.id] = game
            }
          )

          const rankingComPontos =
            (() => {
              const predictionsValidas =
                deduplicarPredicoesGrupos(
                  predictions || []
                )

              return rankingData
                .map(
                  (profile: any) => {
                    const pontosPalpites =
                      Number(
                        profile.pontos || 0
                      )

                    const pontosGrupos =
                      calcularTotalPontosGrupos(
                        profile.id,
                        predictionsValidas,
                        resultsByGroup
                      )

                    const cravadasCalculadas =
                      calcularCravadasUsuario(
                        profile.id,
                        allBets || [],
                        gamesById
                      )

                    return {
                      ...profile,
                      pontos_palpite:
                        pontosPalpites,
                      pontos_grupos:
                        pontosGrupos,
                      pontos_total:
                        pontosPalpites +
                        pontosGrupos,
                      cravadas_total:
                        cravadasCalculadas
                    }
                  }
                )
                .sort(
                  (a: any, b: any) =>
                    b.pontos_total -
                      a.pontos_total ||
                    b.cravadas_total -
                      a.cravadas_total
                )
            })()

          setRanking(rankingComPontos)

          const posicao =
            rankingComPontos.findIndex(
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

        if (gamesData) {
          const proximosJogos =
            gamesData
              .filter(
                (game: any) =>
                  new Date(
                    game.match_date
                  ).getTime() >=
                  Date.now()
              )
              .slice(0, 4)

          setGames(
            proximosJogos.length > 0
              ? proximosJogos
              : gamesData.slice(-4)
          )
        }

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

  }, [router])

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

  const irParaProximosJogos =
    () => {

      router.push('/jogos?proximo=1')

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

minHeight: '100vh',

padding:
  mobile
    ? '18px 14px 90px'
    : '28px',

color: 'white',

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

maxWidth: '100%',

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
                BOLÃO COPA DO MUNDO FIFA 2026
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
                PÁGINA
                <br />

                <span
                  style={{
                    color: '#00ff9d'
                  }}
                >
                INICIAL
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
                compare com seus adversários 
                e tente superá-los.
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
              onClick={irParaProximosJogos}
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
                  {
                    ranking.find(
                      (user: any) =>
                        user.id === perfil?.id
                    )?.pontos_total ??
                    perfil?.pontos ??
                    0
                  }
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
                  {
                    ranking.find(
                      (user: any) =>
                        user.id === perfil?.id
                    )?.cravadas_total ??
                    perfil?.cravadas ??
                    0
                  }
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
                          {user.pontos_total}
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
                          {user.cravadas_total}
                        </div>

                      </div>

                    )

                  })}

              </div>

            </section>

            <div
              style={{
                display: 'flex',

                justifyContent:
                  'center',

                marginTop: '18px'
              }}
            >

              <button
                onClick={() =>
                  router.push(
                    '/ranking'
                  )
                }

                style={{
                  border:
                    '1px solid rgba(0,255,157,0.2)',

                  background:
                    'rgba(0,255,157,0.08)',

                  color:
                    '#00ff9d',

                  padding:
                    mobile
                      ? '12px 18px'
                      : '14px 24px',

                  borderRadius:
                    '14px',

                  fontWeight:
                    'bold',

                  cursor:
                    'pointer',

                  fontSize:
                    mobile
                      ? '12px'
                      : '14px',

                  transition:
                    '0.2s'
                }}
              >
                VER CLASSIFICAÇÃO COMPLETA
              </button>

            </div>

          </div>

          {/* DIREITA */}

          <div
            style={{
              paddingTop:
                mobile
                  ? '24px'
                  : '120px',

              minWidth: 0,

              overflow:
                'hidden'
            }}
          >

            {/* TITULO */}

            <div
              style={{
                display: 'flex',

                justifyContent:
                  'center',

                marginBottom:
                  '16px'
              }}
            >

              <h2
                className="fifa-title"

                style={{
                  fontSize:
                    mobile
                      ? '32px'
                      : '38px',

                  textAlign:
                    'center'
                }}
              >
                MEUS{' '}

                <span
                  style={{
                    color:
                      '#00ff9d'
                  }}
                >
                  PALPITES
                </span>

              </h2>

            </div>

            {/* CARD */}

            <div
              style={{

                border:
                  '1px solid rgba(0,255,157,0.25)',

                borderRadius:
                  '16px',

                overflow:
                  'hidden',

                background:
                  'rgba(0,0,0,0.45)',

                width: '100%',

                maxWidth:
                  mobile
                    ? '100%'
                    : '520px',

                margin:
                  '0 auto',

                boxSizing:
                  'border-box',

                cursor:
                  'pointer'
              }}
            >

              {games.map(
                (
                  game: any,
                  index: number
                ) => {

                const home =
                  getTeam(
                    game.home_team
                  )

                const away =
                  getTeam(
                    game.away_team
                  )

                const bet =
                  getBet(game.id)

                return (

                  <div
                    key={game.id}

                    style={{
                      padding:
                        mobile
                          ? '14px 10px'
                          : '14px 16px',

                      borderBottom:
                        index !==
                        games.length - 1

                          ? '1px solid rgba(255,255,255,0.06)'
                          : 'none'
                    }}
                  >

                    <div
                      style={{
                        display:
                          'flex',

                        flexDirection:
                          'column',

                        alignItems:
                          'center',

                        padding:
                          '12px 0px'
                      }}
                    >

                      {/* LINHA */}

                      <div
                        style={{
                          display:
                            'flex',

                          alignItems:
                            'center',

                          justifyContent:
                            'center',

                          gap:
                            mobile
                              ? '6px'
                              : '10px',

                          width:
                            '100%',

                          overflow:
                            'hidden'
                        }}
                      >

                        {/* HOME */}

                        <div
                          style={{
                            display:
                              'flex',

                            alignItems:
                              'center',

                            gap:
                              '6px',

                            minWidth:
                              0,

                            flex: 1,

                            justifyContent:
                              'flex-end',

                            overflow:
                              'hidden'
                          }}
                        >

                          <p
                            style={{
                              fontSize:
                                mobile
                                  ? '15px'
                                  : '24px',

                              fontWeight:
                                'bold',

                              overflow:
                                'hidden',

                              textOverflow:
                                'ellipsis',

                              whiteSpace:
                                'nowrap'
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
                                  ? '24px'
                                  : '28px',

                              height:
                                mobile
                                  ? '24px'
                                  : '28px',

                              borderRadius:
                                '999px',

                              objectFit:
                                'cover',

                              flexShrink:
                                0
                            }}
                          />

                        </div>

                        {/* SCORE */}

                        <div
                          style={{
                            display:
                              'flex',

                            alignItems:
                              'center',

                            gap:
                              mobile
                                ? '5px'
                                : '8px',

                            flexShrink:
                              0
                          }}
                        >

                          <div
                            style={{
                              width:
                                mobile
                                  ? '30px'
                                  : '36px',

                              height:
                                mobile
                                  ? '30px'
                                  : '36px',

                              border:
                                '1px solid #00ff9d',

                              borderRadius:
                                '8px',

                              display:
                                'flex',

                              alignItems:
                                'center',

                              justifyContent:
                                'center',

                              color:
                                '#00ff9d',

                              fontSize:
                                mobile
                                  ? '18px'
                                  : '24px',

                              fontWeight:
                                'bold'
                            }}
                          >
                            {
                              bet?.home_guess
                              ?? '-'
                            }
                          </div>

                          <div
                            style={{
                              fontSize:
                                mobile
                                  ? '15px'
                                  : '18px',

                              fontWeight:
                                'bold'
                            }}
                          >
                            x
                          </div>

                          <div
                            style={{
                              width:
                                mobile
                                  ? '30px'
                                  : '36px',

                              height:
                                mobile
                                  ? '30px'
                                  : '36px',

                              border:
                                '1px solid #00ff9d',

                              borderRadius:
                                '8px',

                              display:
                                'flex',

                              alignItems:
                                'center',

                              justifyContent:
                                'center',

                              color:
                                '#00ff9d',

                              fontSize:
                                mobile
                                  ? '18px'
                                  : '24px',

                              fontWeight:
                                'bold'
                            }}
                          >
                            {
                              bet?.away_guess
                              ?? '-'
                            }
                          </div>

                        </div>

                        {/* AWAY */}

                        <div
                          style={{
                            display:
                              'flex',

                            alignItems:
                              'center',

                            gap:
                              '6px',

                            minWidth:
                              0,

                            flex: 1,

                            overflow:
                              'hidden'
                          }}
                        >

                          <img
                            src={`https://flagcdn.com/w80/${away?.flag}.png`}

                            alt=""

                            style={{
                              width:
                                mobile
                                  ? '24px'
                                  : '28px',

                              height:
                                mobile
                                  ? '24px'
                                  : '28px',

                              borderRadius:
                                '999px',

                              objectFit:
                                'cover',

                              flexShrink:
                                0
                            }}
                          />

                          <p
                            style={{
                              fontSize:
                                mobile
                                  ? '15px'
                                  : '24px',

                              fontWeight:
                                'bold',

                              overflow:
                                'hidden',

                              textOverflow:
                                'ellipsis',

                              whiteSpace:
                                'nowrap'
                            }}
                          >
                            {away?.nome}
                          </p>

                        </div>

                      </div>

                      {/* DATA */}

                      <div
                        style={{
                          marginTop:
                            '8px',

                          fontSize:
                            mobile
                              ? '10px'
                              : '11px',

                          opacity:
                            0.65
                        }}
                      >
                        {
                          new Date(
                            game.match_date
                          ).toLocaleDateString(
                            'pt-BR',
                            {
                              day:
                                '2-digit',

                              month:
                                '2-digit'
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
                              hour:
                                '2-digit',

                              minute:
                                '2-digit'
                            }
                          )
                        }
                      </div>

                    </div>

                  </div>

                )

              })}

              {/* BTN */}

              <div
                style={{
                  padding:
                    '14px',

                  borderTop:
                    '1px solid rgba(255,255,255,0.05)'
                }}
              >

                <button
                  onClick={() =>
                    irParaProximosJogos()
                  }

                  style={{
                    width:
                      '100%',

                    background:
                      'transparent',

                    border:
                      '1px solid rgba(0,255,157,0.25)',

                    color:
                      '#00ff9d',

                    padding:
                      '12px',

                    borderRadius:
                      '12px',

                    fontSize:
                      '11px',

                    fontWeight:
                      'bold',

                    textTransform:
                      'uppercase',

                    cursor:
                      'pointer'
                  }}
                >
                  Ver todos
                </button>

              </div>

            </div>

          </div>

        </section>

        <br />
        <br />
        <br />

      </main>

    </>

  )

}
