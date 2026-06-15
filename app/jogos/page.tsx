'use client'

import { useEffect, useState } from 'react'

import Navbar from '../components/Navbar'

import { supabase } from '../../lib/supabase'

export default function JogosPage() {

  const [games, setGames] =
    useState<any[]>([])

  const [teams, setTeams] =
    useState<any[]>([])

  const [mobile, setMobile] =
    useState(false)

  const [palpites, setPalpites] =
    useState<any>({})

  const [pagina, setPagina] =
    useState(1)

  const [agora] =
    useState(() => Date.now())

  const jogosPorPagina = 10

  const jogoBloqueado = (
  data: string
) => {

  if (!data) {
    return false
  }

  return (
    new Date(data)
      .getTime() <=
    agora
  )
}

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

        /* GAMES */

        const { data: gamesData } =
          await supabase
            .from('games')
            .select('*')
            .order('match_date', {
              ascending: true
            })

        if (gamesData)
          setGames(gamesData)

        if (
          gamesData &&
          new URLSearchParams(
            window.location.search
          ).get('proximo') === '1'
        ) {
          const proximoIndex =
            gamesData.findIndex(
              (game: any) =>
                new Date(
                  game.match_date
                ).getTime() >=
                Date.now()
            )

          if (proximoIndex >= 0) {
            setPagina(
              Math.floor(
                proximoIndex /
                jogosPorPagina
              ) + 1
            )
          }
        }

        /* TEAMS */

        const { data: teamsData } =
          await supabase
            .from('teams')
            .select('*')

        if (teamsData)
          setTeams(teamsData)

        /* BETS */

        const { data: betsData } =
          await supabase
            .from('bets')
            .select('*')
            .eq('user_id', user.id)

        if (betsData) {

          const formatado: any = {}

          betsData.forEach(
            (bet: any) => {

              formatado[bet.game_id] = {
                home_guess:
                  bet.home_guess,

                away_guess:
                  bet.away_guess
              }

            }
          )

          setPalpites(formatado)

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

  /* TIMES */

  const getTeam =
    (sigla: string) => {

      return teams.find(
        (t: any) =>
          t.nome === sigla
      )

    }

  /* PAGINAÇÃO */

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

  /* SALVAR TODOS */

  const salvarPalpites =
    async () => {

      const { data: authData } =
        await supabase.auth.getUser()

      if (!authData.user) {

        alert(
          'Faça login novamente para salvar seus palpites.'
        )

        return

      }

      const user =
        authData.user

      const payload =
        Object.entries(palpites)
          .filter(
            ([, value]: any) =>
              value.home_guess !== undefined &&
              value.home_guess !== '' &&
              value.away_guess !== undefined &&
              value.away_guess !== ''
          )
          .map(
            ([gameId, value]: any) => ({

              user_id:
                user.id,

              game_id:
                Number(gameId),

              home_guess:
                Number(value.home_guess),

              away_guess:
                Number(value.away_guess)

            })
          )
          .filter(
            (item) =>
              Number.isFinite(
                item.home_guess
              ) &&
              Number.isFinite(
                item.away_guess
              )
          )

      if (payload.length === 0) {

        alert(
          'Preencha pelo menos um palpite antes de salvar.'
        )

        return

      }

      for (const item of payload) {

        const {
          data: palpiteExistente,
          error: buscaError
        } = await supabase
          .from('bets')
          .select('id')
          .eq(
            'user_id',
            item.user_id
          )
          .eq(
            'game_id',
            item.game_id
          )
          .maybeSingle()

        if (buscaError) {

          console.error(
            'Erro ao buscar palpite:',
            buscaError
          )

          alert(
            `Erro ao buscar palpite: ${buscaError.message}`
          )

          return

        }

        if (palpiteExistente?.id) {

          const { error: updateError } =
            await supabase
              .from('bets')
              .update({
                home_guess:
                  item.home_guess,
                away_guess:
                  item.away_guess
              })
              .eq(
                'id',
                palpiteExistente.id
              )

          if (updateError) {

            console.error(
              'Erro ao atualizar palpite:',
              updateError
            )

            alert(
              `Erro ao atualizar palpite: ${updateError.message}`
            )

            return

          }

          continue

        }

        const { error: insertError } =
          await supabase
            .from('bets')
            .insert(item)

        if (insertError) {

          console.error(
            'Erro ao inserir palpite:',
            insertError
          )

          alert(
            `Erro ao inserir palpite: ${insertError.message}`
          )

          return

        }

      }

      alert(
        'Palpites salvos!'
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

          color: 'white',

          minHeight: '100vh'
        }}
      >

        {/* HERO */}

        <section
          style={{
            marginBottom: '28px'
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
                  ? '54px'
                  : '72px',

              lineHeight: 0.9,

              marginBottom: '12px'
            }}
          >
            TODOS{' '}

            <span
              style={{
                color: '#00ff9d'
              }}
            >
              OS JOGOS
            </span>

          </h1>

          <p
            style={{
              opacity: 0.7,
              maxWidth: '520px',
              lineHeight: 1.5
            }}
          >
            Análise os confrontos e faça seus palpites.
          </p>

        </section>

        {/* PAGINAÇÃO TOPO */}

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',

            gap: '8px',

            marginBottom: '18px',

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

            gap: '16px',

            maxWidth: '700px',

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

            const bloqueado = 
            jogoBloqueado(
              game.match_date
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

                  borderRadius: '18px',

                  overflow: 'hidden'
                }}
              >

                {/* BODY */}

                <div
                  style={{
                    padding:
                      mobile
                        ? '18px 14px'
                        : '20px 22px'
                  }}
                >
<p
  style={{
    fontSize:
      mobile
        ? '10px'
        : '11px',

    opacity: 0.55,

    marginBottom: '10px',

    textTransform:
      'uppercase',

    letterSpacing:
      '0.04em',

       textAlign:
      'center'
  }}
>
                     
  {game.group_name} • {game.round}° Rodada
</p>
                  {/* LINHA */}

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',

                      gap:
                        mobile
                          ? '8px'
                          : '14px'
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
                            ? '85px'
                            : '110px',

                        justifyContent:
                          'flex-end'
                      }}
                    >

                      <p
                        style={{
                          fontSize:
                            mobile
                              ? '22px'
                              : '30px',

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
                              ? '28px'
                              : '36px',

                          height:
                            mobile
                              ? '28px'
                              : '36px',

                          borderRadius:
                            '999px',

                          objectFit: 'cover'
                        }}
                      />

                    </div>

                    {/* SCORE */}

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',

                        gap:
                          mobile
                            ? '6px'
                            : '10px'
                      }}
                    >

                      {/* HOME */}

                      <input
                        type="text"
                        inputMode='numeric'
                        pattern='[0-20]*'

                        disabled={
                          bloqueado
                        }

                        value={
                          palpites[
                            game.id
                          ]?.home_guess ?? ''
                        }

                        onChange={(e) => {

                          setPalpites({
                            ...palpites,

                            [game.id]: {

                              ...palpites[
                                game.id
                              ],

                              home_guess:
                                e.target.value
                            }
                          })

                        }}

                        style={{
                          width:
                            mobile
                              ? '42px'
                              : '52px',

                          height:
                            mobile
                              ? '42px'
                              : '52px',

                          borderRadius:
                            '10px',

                          border:
                            '1px solid #00ff9d',

                          background:
                            bloqueado
                              ? 'rgba(255,255,255,0.04)'
                              : 'rgba(0,255,157,0.08)',

                          color:
                            bloqueado
                              ? '#888'
                              : '#00ff9d',

                          textAlign: 'center',

                          fontSize:
                            mobile
                              ? '22px'
                              : '28px',

                          fontWeight: 'bold'
                        }}
                      />

                      <span
                        style={{
                          fontSize:
                            mobile
                              ? '18px'
                              : '24px',

                          opacity: 0.7
                        }}
                      >
                        x
                      </span>

                      {/* AWAY */}

                       <input
                        type="text"
                        inputMode='numeric'
                        pattern='[0-20]*'

                        disabled={
                          bloqueado
                        }

                        value={
                          palpites[
                            game.id
                          ]?.away_guess ?? ''
                        }

                        onChange={(e) => {

                          setPalpites({
                            ...palpites,

                            [game.id]: {

                              ...palpites[
                                game.id
                              ],

                              away_guess:
                                e.target.value
                            }
                          })

                        }}

                        style={{
                          width:
                            mobile
                              ? '42px'
                              : '52px',

                          height:
                            mobile
                              ? '42px'
                              : '52px',

                          borderRadius:
                            '10px',

                          border:
                            '1px solid #00ff9d',

                          background:
                            bloqueado
                              ? 'rgba(255,255,255,0.04)'
                              : 'rgba(0,255,157,0.08)',

                          color:
                            bloqueado
                              ? '#888'
                              : '#00ff9d',

                          textAlign: 'center',

                          fontSize:
                            mobile
                              ? '22px'
                              : '28px',

                          fontWeight: 'bold'
                        }}
                      />

                    </div>

                    {/* AWAY */}

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',

                        gap: '8px',

                        minWidth:
                          mobile
                            ? '85px'
                            : '110px'
                      }}
                    >

                      <img
                        src={`https://flagcdn.com/w80/${away?.flag}.png`}
                        alt=""

                        style={{
                          width:
                            mobile
                              ? '28px'
                              : '36px',

                          height:
                            mobile
                              ? '28px'
                              : '36px',

                          borderRadius:
                            '999px',

                          objectFit: 'cover'
                        }}
                      />

                      <p
                        style={{
                          fontSize:
                            mobile
                              ? '22px'
                              : '30px',

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
                      marginTop: '14px',

                      textAlign: 'center',

                      fontSize: '12px',

                      opacity: 0.7,

                      letterSpacing: '0.04em'
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

                  {/* BLOQUEADO */}

                  {bloqueado && (

                    <div
                      style={{
                        marginTop: '14px',

                        textAlign: 'center',

                        fontSize: '11px',

                        color: '#ff5a5a',

                        letterSpacing: '0.06em',

                        textTransform:
                          'uppercase'
                      }}
                    >
                      Palpites encerrados
                    </div>

                  )}

                </div>

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

        {/* SALVAR */}

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',

            marginTop: '24px'
          }}
        >

          <button
            onClick={
              salvarPalpites
            }

            style={{
              width: '100%',

              maxWidth: '700px',

              height: '58px',

              borderRadius: '16px',

              border: 'none',

              background:
                'linear-gradient(90deg,#00ff9d,#00c3ff)',

              color: 'black',

              fontWeight: 'bold',

              fontSize: '13px',

              letterSpacing:
                '0.08em',

              textTransform:
                'uppercase',

              cursor: 'pointer'
            }}
          >
            Salvar palpites
          </button>

        </div>

      </main>

    </>

  )

}
