'use client'

import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import {
  calcularPontosGrupo,
  deduplicarPredicoesGrupos,
  DIVULGACAO_GRUPOS,
  ORDEM_GRUPOS,
  POSICOES_GRUPO
} from '../../lib/grupos'

export default function GruposPublicosPage() {
  const router = useRouter()

  const [mobile, setMobile] =
    useState(false)

  const [groups, setGroups] =
    useState<Record<string, any[]>>({})

  const [officialGroups, setOfficialGroups] =
    useState<Record<string, any>>({})

  const [profiles, setProfiles] =
    useState<any[]>([])

  const [teams, setTeams] =
    useState<any[]>([])

  const [pagina, setPagina] =
    useState(0)

  const [userId, setUserId] =
    useState('')

  const [agora, setAgora] =
    useState(() => Date.now())

  const [erroResultado, setErroResultado] =
    useState('')

  const liberado =
    agora >= DIVULGACAO_GRUPOS

  useEffect(() => {

    const checkMobile = () =>
      setMobile(
        window.innerWidth <= 900
      )

    checkMobile()

    window.addEventListener(
      'resize',
      checkMobile
    )

    const relogio =
      window.setInterval(
        () => {
          setAgora(Date.now())
        },
        30000
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

        setUserId(
          authData.user.id
        )

        const {
          data: predictions
        } =
          await supabase
            .from(
              'group_predictions'
            )
            .select('*')

        const {
          data: profilesData
        } =
          await supabase
            .from('profiles')
            .select('*')

        const {
          data: teamsData
        } =
          await supabase
            .from('teams')
            .select('*')

        const resultQuery =
          await supabase
            .from('group_results')
            .select('*')

        let results =
          resultQuery.data

        if (resultQuery.error) {

          const fallbackQuery =
            await supabase
              .from('groups_results')
              .select('*')

          results =
            fallbackQuery.data

          if (fallbackQuery.error) {
            setErroResultado(
              fallbackQuery.error.message
            )
          }

        }

        if (profilesData)
          setProfiles(
            profilesData
          )

        if (teamsData)
          setTeams(
            teamsData
          )

        const agrupados: Record<string, any[]> = {}

        deduplicarPredicoesGrupos(
          predictions || []
        ).forEach(
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

        const oficiais: Record<string, any> = {}

        results?.forEach(
          (item: any) => {
            oficiais[
              item.group_name
            ] = item
          }
        )

        setGroups(
          agrupados
        )

        setOfficialGroups(
          oficiais
        )

      }

    carregar()

    return () => {

      window.removeEventListener(
        'resize',
        checkMobile
      )

      window.clearInterval(
        relogio
      )

    }

  }, [router])

  const grupoAtual =
    ORDEM_GRUPOS[pagina]

  const palpites =
    groups[grupoAtual] || []

  const oficial =
    officialGroups[grupoAtual]

  const meuPalpite =
    palpites.find(
      (p: any) =>
        p.user_id === userId
    )

  const rivais =
    palpites.filter(
      (p: any) =>
        p.user_id !== userId
    )

  const getProfile =
    (id: string) =>
      profiles.find(
        (p: any) =>
          p.id === id
      )

  const getTeam =
    (sigla: string) =>
      teams.find(
        (t: any) =>
          t.nome === sigla
      )

  const contarAcertos =
    (item: any) => {

      if (!oficial)
        return 0

      return POSICOES_GRUPO.filter(
        (posicao) =>
          item?.[posicao] ===
          oficial?.[posicao]
      ).length

    }

  const pontosDoPalpite =
    (item: any) =>
      calcularPontosGrupo(
        item,
        oficial
      )

  const renderTeam =
    (
      sigla: string,
      posicao: number,
      comparacao?: string
    ) => {

      const team =
        getTeam(sigla)

      const acertou =
        comparacao &&
        sigla === comparacao

      const errou =
        comparacao &&
        sigla !== comparacao

      return (

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'space-between',
            gap: '10px',
            padding: '10px 12px',
            borderRadius: '12px',
            background:
              acertou
                ? 'rgba(0,255,157,0.08)'
                : 'rgba(255,255,255,0.03)',
            border:
              acertou
                ? '1px solid rgba(0,255,157,0.28)'
                : errou
                ? '1px solid rgba(255,90,90,0.22)'
                : '1px solid rgba(255,255,255,0.05)'
          }}
        >

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              minWidth: 0
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

            {team?.flag && (

              <img
                src={`https://flagcdn.com/w80/${team.flag}.png`}
                alt=""
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius:
                    '999px',
                  objectFit:
                    'cover',
                  flexShrink: 0
                }}
              />

            )}

            <div
              style={{
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
              {sigla}
            </div>

          </div>

          {comparacao && (

            <span
              style={{
                color:
                  acertou
                    ? '#00ff9d'
                    : '#ff6b6b',
                fontSize: '11px',
                fontWeight: 'bold',
                flexShrink: 0
              }}
            >
              {acertou ? 'OK' : `Era ${comparacao}`}
            </span>

          )}

        </div>

      )

    }

  const renderListaGrupo =
    (
      item: any,
      comparar = false
    ) => (

      <div
        style={{
          display: 'flex',
          flexDirection:
            'column',
          gap: '10px'
        }}
      >

        {POSICOES_GRUPO.map(
          (posicao, index) =>
            renderTeam(
              item?.[posicao],
              index + 1,
              comparar
                ? oficial?.[posicao]
                : undefined
            )
        )}

      </div>

    )

  const renderCard =
    (
      item: any,
      titulo?: string
    ) => {

      const profile =
        getProfile(
          item.user_id
        )

      const acertos =
        contarAcertos(item)

      const pontos =
        pontosDoPalpite(item)

      return (

        <div
          key={`${titulo || 'palpite'}-${item.user_id}`}
          style={{
            border:
              item.user_id === userId
                ? '1px solid rgba(0,255,157,0.3)'
                : '1px solid rgba(0,255,157,0.18)',

            background:
              'rgba(0,0,0,0.45)',

            boxShadow:
              '0 0 30px rgba(0,255,157,0.06)',

            borderRadius:
              '20px',

            padding:
              '20px'
          }}
        >

          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              alignItems:
                'center',
              gap: '10px',
              marginBottom:
                '18px'
            }}
          >

            <div
              style={{
                display: 'flex',
                alignItems:
                  'center',
                gap: '10px',
                minWidth: 0
              }}
            >

              <div
                style={{
                  width: '34px',
                  height: '34px',
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
                  flexShrink: 0
                }}
              >
                {
                  profile
                    ?.iniciais ||
                  '--'
                }
              </div>

              <div
                style={{
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
                {
                  titulo ||
                  profile
                    ?.nome ||
                  'Participante'
                }
              </div>

            </div>

            <div
              style={{
                color: '#00ff9d',
                fontSize: '12px',
                fontWeight: 'bold',
                flexShrink: 0
              }}
            >
              {pontos}/20 pts
            </div>

          </div>

          {renderListaGrupo(
            item,
            Boolean(oficial)
          )}

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

          color:
            'white'
        }}
      >

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
              maxWidth: '620px',
              lineHeight: 1.5
            }}
          >
            Resultado oficial dos grupos e comparação dos palpites dos participantes.
          </p>

        </section>

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
                '24px',
              textAlign:
                'center'
            }}
          >

            <h2>
              Palpites ainda ocultos
            </h2>

            <p
              style={{
                opacity: 0.65,
                marginTop: '8px'
              }}
            >
              Eles serão liberados após a data e hora de divulgação.
            </p>

          </div>

        )}

        {liberado && (

          <>

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

              {ORDEM_GRUPOS.map(
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
                      width: '44px',
                      height:'44px',
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

                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    {grupo}
                  </button>

                )
              )}

            </div>

            <section
              style={{
                maxWidth:
                  '1100px',
                margin:
                  '0 auto'
              }}
            >

              <h2
                className="fifa-title"
                style={{
                  fontSize:
                    mobile
                      ? '34px'
                      : '44px',
                  textAlign:
                    'center',
                  marginBottom:
                    '18px'
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

              {erroResultado && (

                <div
                  style={{
                    border:
                      '1px solid rgba(255,90,90,0.22)',
                    background:
                      'rgba(255,90,90,0.08)',
                    borderRadius:
                      '16px',
                    padding:
                      '16px',
                    marginBottom:
                      '18px',
                    color:
                      '#ff8a8a',
                    textAlign:
                      'center'
                  }}
                >
                  Erro ao buscar resultado oficial: {erroResultado}
                </div>

              )}

              {oficial ? (

                <div
                  style={{
                    marginBottom:
                      '18px',
                    border:
                      '1px solid rgba(255,196,0,0.28)',
                    background:
                      'rgba(255,196,0,0.07)',
                    borderRadius:
                      '20px',
                    padding:
                      '20px'
                  }}
                >

                  <h3
                    style={{
                      textAlign:
                        'center',
                      marginBottom:
                        '14px',
                      color:
                        '#ffc400'
                    }}
                  >
                    RESULTADO OFICIAL
                  </h3>

                  {renderListaGrupo(
                    oficial
                  )}

                </div>

              ) : (

                <div
                  style={{
                    border:
                      '1px solid rgba(255,255,255,0.08)',
                    background:
                      'rgba(255,255,255,0.03)',
                    borderRadius:
                      '16px',
                    padding:
                      '18px',
                    marginBottom:
                      '18px',
                    textAlign:
                      'center'
                  }}
                >
                  Nenhum resultado oficial cadastrado para este grupo.
                </div>

              )}

              {meuPalpite && (

                <div
                  style={{
                    marginBottom:
                      '18px'
                  }}
                >
                  {renderCard(
                    meuPalpite,
                    'Meu palpite'
                  )}
                </div>

              )}

              <div
                style={{
                  display: 'grid',

                  gridTemplateColumns:
                    mobile
                      ? '1fr'
                      : 'repeat(auto-fit,minmax(280px,1fr))',

                  gap:
                    '18px'
                }}
              >

                {rivais.map(
                  (item) =>
                    renderCard(item)
                )}

              </div>

            </section>

          </>

        )}

      </main>

    </>

  )

}
