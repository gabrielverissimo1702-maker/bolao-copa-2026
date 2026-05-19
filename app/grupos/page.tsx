'use client'

import { useEffect, useState } from 'react'

import Navbar from '../components/Navbar'

import { supabase } from '../../lib/supabase'

import {
  DndContext,
  closestCenter
} from '@dnd-kit/core'

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable'

import {
  useSortable
} from '@dnd-kit/sortable'

import {
  CSS
} from '@dnd-kit/utilities'

function SortableTeam({
  id,
  index,
  mobile,
  teamsData
}: any) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id })

  const style = {
    transform:
      CSS.Transform.toString(
        transform
      ),

    transition
  }

  const team =
    teamsData.find(
      (t: any) =>
        t.nome === id
    )

  return (

    <div
      ref={setNodeRef}

      style={{
        ...style,

        height:
          mobile
            ? '56px'
            : '64px',

        borderRadius:
          '14px',

        border:
          '1px solid rgba(255,255,255,0.06)',

        background:
          'rgba(255,255,255,0.03)',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',

        padding:
          '0 16px',

        cursor: 'grab'
      }}

      {...attributes}
      {...listeners}
    >

      {/* LEFT */}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',

          gap: '12px'
        }}
      >

        {/* POS */}

        <div
          style={{
            width:
              mobile
                ? '28px'
                : '34px',

            height:
              mobile
                ? '28px'
                : '34px',

            borderRadius:
              '999px',

            background:
              'rgba(0,255,157,0.08)',

            border:
              '1px solid rgba(0,255,157,0.2)',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            fontSize:
              mobile
                ? '12px'
                : '14px',

            fontWeight: 'bold',

            color: '#00ff9d'
          }}
        >
          {index + 1}
        </div>

        {/* FLAG */}

        <img
          src={`https://flagcdn.com/w80/${team?.flag}.png`}
          alt=""

          style={{
            width:
              mobile
                ? '28px'
                : '34px',

            height:
              mobile
                ? '28px'
                : '34px',

            borderRadius:
              '999px',

            objectFit: 'cover'
          }}
        />

        {/* TEAM */}

        <div
          style={{
            fontSize:
              mobile
                ? '18px'
                : '22px',

            fontWeight: 'bold'
          }}
        >
          {id}
        </div>

      </div>

      {/* DRAG */}

      <div
        style={{
          opacity: 0.35,

          fontSize:
            mobile
              ? '18px'
              : '22px'
        }}
      >
        ☰
      </div>

    </div>

  )

}

export default function GruposPage() {

  const [mobile, setMobile] =
    useState(false)

  const [groups, setGroups] =
    useState<any>({})

  const [teamsData, setTeamsData] =
  useState<any[]>([])  
    

  const [userId, setUserId] =
    useState<string | null>(null)

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

        /* USER */

        const { data: authData } =
          await supabase.auth.getUser()

        if (authData.user)
          setUserId(authData.user.id)

        /* TEAMS */

        const { data: teamsData } =
          await supabase
            .from('teams')
            .select('*')
            .order('nome')

        if (!teamsData)
          return

        setTeamsData(teamsData)

        const agrupados: any = {}

        teamsData.forEach(
          (team: any) => {

            if (
              !agrupados[
                team.group_name
              ]
            ) {

              agrupados[
                team.group_name
              ] = []

            }

            agrupados[
              team.group_name
            ].push(team.nome)

          }
        )

        /* PREDICTIONS */

        if (authData.user) {

          const {
            data: predictions
          } = await supabase
            .from(
              'group_predictions'
            )
            .select('*')
            .eq(
              'user_id',
              authData.user.id
            )

          if (
            predictions &&
            predictions.length > 0
          ) {

            predictions.forEach(
              (p: any) => {

                agrupados[
                  p.group_name
                ] = [

                  p.first_place,

                  p.second_place,

                  p.third_place,

                  p.fourth_place

                ]

              }
            )

          }

        }

        setGroups(agrupados)

      }

    carregar()

    return () => {

      window.removeEventListener(
        'resize',
        checkMobile
      )

    }

  }, [])

  /* BLOQUEIO */

  const bloqueado =
    new Date() >=
    new Date(
      '2026-06-11T16:00:00'
    )

  /* DRAG */

  const handleDragEnd =
    (
      event: any,
      groupName: string
    ) => {

      const {
        active,
        over
      } = event

      if (
        !over ||
        active.id === over.id
      )
        return

      const items =
        groups[groupName]

      const oldIndex =
        items.indexOf(
          active.id
        )

      const newIndex =
        items.indexOf(
          over.id
        )

      const novo =
        arrayMove(
          items,
          oldIndex,
          newIndex
        )

      setGroups({
        ...groups,

        [groupName]:
          novo
      })

    }

  /* SAVE */

  const salvar =
    async () => {

      if (!userId)
        return

      const payload =
        Object.entries(groups)
          .map(
            (
              [group, teams]: any
            ) => ({

              user_id:
                userId,

              group_name:
                group,

              first_place:
                teams[0],

              second_place:
                teams[1],

              third_place:
                teams[2],

              fourth_place:
                teams[3]

            })
          )

      await supabase
        .from(
          'group_predictions'
        )
        .upsert(payload)

      alert(
        'Grupos salvos!'
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
            COPA DO MUNDO 2026
          </p>

          <h1
            className="fifa-title"

            style={{
              fontSize:
                mobile
                  ? '48px'
                  : '72px',

              lineHeight: 0.9,

              marginBottom: '12px'
            }}
          >
            FASE{' '}

            <span
              style={{
                color: '#00ff9d'
              }}
            >
              DE GRUPOS
            </span>

          </h1>

          <p
            style={{
              opacity: 0.7,

              maxWidth: '520px',

              lineHeight: 1.5
            }}
          >
            Arraste as seleções
            para montar sua
            classificação final.
          </p>

        </section>

        {/* BLOQUEADO */}

        {bloqueado && (

          <div
            style={{
              marginBottom: '22px',

              borderRadius:
                '16px',

              border:
                '1px solid rgba(255,80,80,0.2)',

              background:
                'rgba(255,80,80,0.06)',

              padding:
                '18px',

              textAlign:
                'center',

              color: '#ff8080',

              fontWeight: 'bold'
            }}
          >
            Palpites encerrados
          </div>

        )}

        {/* GROUPS */}

        <section
          style={{
            display: 'grid',

            gridTemplateColumns:
              mobile
                ? '1fr'
                : '1fr 1fr',

            gap: '18px'
          }}
        >

          {Object.keys(groups)
            .sort()
            .map(
              (groupName) => (

              <div
                key={groupName}

                style={{
                  border:
                    '1px solid rgba(0,255,157,0.18)',

                  background:
                    'rgba(0,0,0,0.45)',

                  boxShadow:
                    '0 0 30px rgba(0,255,157,0.06)',

                  borderRadius:
                    '20px',

                  overflow:
                    'hidden'
                }}
              >

                {/* HEADER */}

                <div
                  style={{
                    height: '68px',

                    borderBottom:
                      '1px solid rgba(255,255,255,0.05)',

                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:
                      'space-between',

                    padding:
                      '0 18px'
                  }}
                >

                  <h2
                    className="fifa-title"

                    style={{
                      fontSize:
                        mobile
                          ? '28px'
                          : '34px'
                    }}
                  >
                    GRUPO{' '}

                    <span
                      style={{
                        color:
                          '#00ff9d'
                      }}
                    >
                      {groupName}
                    </span>

                  </h2>

                </div>

                {/* LIST */}

                <div
                  style={{
                    padding:
                      '14px',

                    display: 'flex',
                    flexDirection:
                      'column',

                    gap: '10px',

                    opacity:
                      bloqueado
                        ? 0.6
                        : 1,

                    pointerEvents:
                      bloqueado
                        ? 'none'
                        : 'all'
                  }}
                >

                  <DndContext
                    collisionDetection={
                      closestCenter
                    }

                    onDragEnd={
                      (event) =>
                        handleDragEnd(
                          event,
                          groupName
                        )
                    }
                  >

                    <SortableContext
                      items={
                        groups[
                          groupName
                        ]
                      }

                      strategy={
                        verticalListSortingStrategy
                      }
                    >

                      {
                        groups[
                          groupName
                        ]?.map(
                          (
                            team: string,
                            index: number
                          ) => (

                          <SortableTeam
  key={team}

  id={team}

  index={index}

  mobile={mobile}

  teamsData={teamsData}
/>
                        ))
                      }

                    </SortableContext>

                  </DndContext>

                </div>

              </div>

            ))}

        </section>

        {/* SAVE */}

        {!bloqueado && (

          <div
            style={{
              display: 'flex',
              justifyContent:
                'center',

              marginTop: '28px'
            }}
          >

            <button
              onClick={salvar}

              style={{
                width: '100%',

                maxWidth: '720px',

                height: '58px',

                borderRadius:
                  '16px',

                border: 'none',

                background:
                  'linear-gradient(90deg,#00ff9d,#00c3ff)',

                color: 'black',

                fontWeight:
                  'bold',

                fontSize: '13px',

                letterSpacing:
                  '0.08em',

                textTransform:
                  'uppercase',

                cursor: 'pointer'
              }}
            >
              Salvar grupos
            </button>

          </div>

        )}

      </main>

    </>

  )

}