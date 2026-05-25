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

  const [userId, setUserId] =
    useState('')

  const ordemGrupos = [
    'A','B','C','D',
    'E','F','G','H',
    'I','J','K','L'
  ]

  const liberado =
    new Date().getTime() >=
    new Date(
      '2026-06-11T16:00:00'
    ).getTime()

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

        if (profilesData)
          setProfiles(
            profilesData
          )

        if (teamsData)
          setTeams(
            teamsData
          )

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

  const oficial =
    palpites[0]

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
            padding: '10px 12px',
            borderRadius: '12px',
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
                  'cover'
              }}
            />

          )}

          <div
            style={{
              fontWeight:
                'bold'
            }}
          >
            {sigla}
          </div>

        </div>

      )

    }

  const renderCard =
    (item: any) => {

      const profile =
        getProfile(
          item.user_id
        )

      return (

        <div
          key={item.user_id}
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
              '20px'
          }}
        >

          <div
            style={{
              display: 'flex',
              justifyContent:
                'center',
              alignItems:
                'center',
              gap: '10px',
              marginBottom:
                '18px'
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
                  'bold'
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
                  'bold'
              }}
            >
              {
                profile
                  ?.nome
              }
            </div>

          </div>

          <div
            style={{
              display: 'flex',
              flexDirection:
                'column',
              gap: '10px'
            }}
          >

            {renderTeam(
              item.first_place,
              1
            )}

            {renderTeam(
              item.second_place,
              2
            )}

            {renderTeam(
              item.third_place,
              3
            )}

            {renderTeam(
              item.fourth_place,
              4
            )}

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
              opacity: 0.7
            }}
          >
            Veja como cada
            participante acredita
            que terminarão os
            grupos da Copa.
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
                          : 'white'
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

              {oficial && (

                <div
                  style={{
                    marginBottom:
                      '18px'
                  }}
                >

                  <h3
                    style={{
                      textAlign:
                        'center',
                      marginBottom:
                        '14px'
                    }}
                  >
                    RESULTADO OFICIAL
                  </h3>

                  {renderTeam(
                    oficial.first_place,
                    1
                  )}

                  {renderTeam(
                    oficial.second_place,
                    2
                  )}

                  {renderTeam(
                    oficial.third_place,
                    3
                  )}

                  {renderTeam(
                    oficial.fourth_place,
                    4
                  )}

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
                    meuPalpite
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
                  renderCard
                )}

              </div>

            </section>

          </>

        )}

      </main>

    </>

  )

}