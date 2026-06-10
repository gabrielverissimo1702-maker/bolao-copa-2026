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

  const getResultado =
    (home: number, away: number) => {

      if (home > away)
        return 'home'

      if (away > home)
        return 'away'

      return 'draw'

    }

  const calcularPontuacaoJogo =
    (
      bet: any,
      game: any
    ) => {

      const placarValido =
        game.home_score !== null &&
        game.home_score !== undefined &&
        game.away_score !== null &&
        game.away_score !== undefined

      if (!placarValido) {
        return {
          pontos: 0,
          tipo: 'pendente',
          label: 'Aguardando'
        }
      }

      const homeScore =
        Number(game.home_score)

      const awayScore =
        Number(game.away_score)

      const homeGuess =
        Number(bet.home_guess)

      const awayGuess =
        Number(bet.away_guess)

      if (
        homeGuess === homeScore &&
        awayGuess === awayScore
      ) {
        return {
          pontos: 5,
          tipo: 'cravada',
          label: 'Cravada'
        }
      }

      if (
        getResultado(
          homeGuess,
          awayGuess
        ) ===
        getResultado(
          homeScore,
          awayScore
        )
      ) {
        return {
          pontos: 2,
          tipo: 'acerto',
          label: 'Acerto'
        }
      }

      return {
        pontos: 0,
        tipo: 'erro',
        label: 'Errou'
      }

    }

  const getPontuacaoStyle =
    (tipo: string) => {

      if (tipo === 'cravada') {
        return {
          border:
            '1px solid rgba(255,196,0,0.42)',
          background:
            'rgba(255,196,0,0.10)',
          color: '#ffc400',
          shadow:
            '0 0 24px rgba(255,196,0,0.12)'
        }
      }

      if (tipo === 'acerto') {
        return {
          border:
            '1px solid rgba(0,255,157,0.34)',
          background:
            'rgba(0,255,157,0.09)',
          color: '#00ff9d',
          shadow:
            '0 0 22px rgba(0,255,157,0.10)'
        }
      }

      if (tipo === 'erro') {
        return {
          border:
            '1px solid rgba(255,90,90,0.22)',
          background:
            'rgba(255,90,90,0.06)',
          color: '#ff8080',
          shadow: 'none'
        }
      }

      return {
        border:
          '1px solid rgba(255,255,255,0.08)',
        background:
          'rgba(255,255,255,0.03)',
        color: 'rgba(255,255,255,0.65)',
        shadow: 'none'
      }

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
            BOLÃO COPA DO MUNDO FIFA 2026
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
            Veja seus palpites e 
            de todos os seus adversários.
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

            const resultadoMeuPalpite =
              meuPalpite
                ? calcularPontuacaoJogo(
                  meuPalpite,
                  game
                )
                : null

            const estiloMeuPalpite =
              resultadoMeuPalpite
                ? getPontuacaoStyle(
                  resultadoMeuPalpite.tipo
                )
                : null

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
                          marginBottom: '22px',
                          border:
                            estiloMeuPalpite?.border,
                          background:
                            estiloMeuPalpite?.background,
                          boxShadow:
                            estiloMeuPalpite?.shadow,
                          borderRadius: '16px',
                          padding:
                            mobile
                              ? '14px 12px'
                              : '16px'
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

                        {resultadoMeuPalpite && (

                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              marginBottom: '12px'
                            }}
                          >
                            <div
                              style={{
                                border:
                                  estiloMeuPalpite?.border,
                                background:
                                  'rgba(0,0,0,0.22)',
                                color:
                                  estiloMeuPalpite?.color,
                                borderRadius: '999px',
                                padding: '7px 12px',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '0.06em'
                              }}
                            >
                              {resultadoMeuPalpite.label} • {resultadoMeuPalpite.pontos} pts
                            </div>
                          </div>

                        )}

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

                          const resultadoPalpite =
                            calcularPontuacaoJogo(
                              bet,
                              game
                            )

                          const estiloPalpite =
                            getPontuacaoStyle(
                              resultadoPalpite.tipo
                            )

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
                                  estiloPalpite.background,

                                border:
                                  estiloPalpite.border,

                                boxShadow:
                                  estiloPalpite.shadow
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

                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  marginBottom: '12px'
                                }}
                              >
                                <div
                                  style={{
                                    border:
                                      estiloPalpite.border,
                                    background:
                                      'rgba(0,0,0,0.22)',
                                    color:
                                      estiloPalpite.color,
                                    borderRadius: '999px',
                                    padding: '6px 10px',
                                    fontSize: '10px',
                                    fontWeight: 'bold',
                                    textTransform:
                                      'uppercase',
                                    letterSpacing:
                                      '0.06em'
                                  }}
                                >
                                  {resultadoPalpite.label} • {resultadoPalpite.pontos} pts
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
