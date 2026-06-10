'use client'

import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { supabase } from '../../lib/supabase'
import {
  DIVULGACAO_GRUPOS,
  ORDEM_GRUPOS
} from '../../lib/grupos'

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

type Team = {
  nome: string
  flag?: string
  group_name?: string
}

type GroupsState =
  Record<string, string[]>

type EditMode = 'drag' | 'table'

function isGruposBloqueado() {
  return Date.now() >= DIVULGACAO_GRUPOS
}

function TeamRow({
  id,
  index,
  mobile,
  teamsData,
  locked = false
}: {
  id: string
  index: number
  mobile: boolean
  teamsData: Team[]
  locked?: boolean
}) {

  const sortable =
    useSortable({
      id,
      disabled: locked
    })

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = sortable

  const team =
    teamsData.find(
      (t) =>
        t.nome === id
    )

  return (

    <div
      ref={setNodeRef}
      style={{
        transform:
          CSS.Transform.toString(
            transform
          ),
        transition,
        height:
          mobile
            ? '56px'
            : '64px',
        borderRadius: '14px',
        border:
          '1px solid rgba(255,255,255,0.06)',
        background:
          locked
            ? 'rgba(255,255,255,0.025)'
            : 'rgba(255,255,255,0.03)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        cursor:
          locked
            ? 'default'
            : 'grab'
      }}
      {...attributes}
      {...(!locked ? listeners : {})}
    >

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          minWidth: 0
        }}
      >

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
            borderRadius: '999px',
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
            color: '#00ff9d',
            flexShrink: 0
          }}
        >
          {index + 1}
        </div>

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
            borderRadius: '999px',
            objectFit: 'cover',
            flexShrink: 0
          }}
        />

        <div
          style={{
            fontSize:
              mobile
                ? '18px'
                : '22px',
            fontWeight: 'bold',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {id}
        </div>

      </div>

      <div
        style={{
          opacity:
            locked
              ? 0.2
              : 0.35,
          fontSize:
            mobile
              ? '16px'
              : '20px'
        }}
      >
        {locked ? 'OK' : '☰'}
      </div>

    </div>

  )

}

function GroupPositionGrid({
  groupName,
  orderedTeams,
  allTeams,
  mobile,
  locked,
  onSelectPosition
}: {
  groupName: string
  orderedTeams: string[]
  allTeams: Team[]
  mobile: boolean
  locked: boolean
  onSelectPosition: (
    teamName: string,
    positionIndex: number
  ) => void
}) {

  const groupTeams =
    allTeams
      .filter(
        (team) =>
          team.group_name === groupName
      )
      .map(
        (team) =>
          team.nome
      )
      .sort()

  return (

    <div
      style={{
        overflowX: 'auto'
      }}
    >

      <div
        style={{
          minWidth:
            mobile
              ? '420px'
              : '100%',
          display: 'grid',
          gridTemplateColumns:
            'minmax(90px,1fr) repeat(4,56px)',
          gap: '8px',
          alignItems: 'center'
        }}
      >

        <div />

        {[1, 2, 3, 4].map(
          (position) => (

            <div
              key={position}
              style={{
                textAlign: 'center',
                color: '#00ff9d',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              {position}º
            </div>

          )
        )}

        {groupTeams.map(
          (teamName) => {

            const team =
              allTeams.find(
                (item) =>
                  item.nome === teamName
              )

            const currentPosition =
              orderedTeams.indexOf(
                teamName
              )

            return (

              <div
                key={teamName}
                style={{
                  display: 'contents'
                }}
              >

                <div
                  style={{
                    height: '48px',
                    borderRadius: '12px',
                    border:
                      '1px solid rgba(255,255,255,0.06)',
                    background:
                      'rgba(255,255,255,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '0 10px',
                    minWidth: 0
                  }}
                >
                  <img
                    src={`https://flagcdn.com/w80/${team?.flag}.png`}
                    alt=""
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '999px',
                      objectFit: 'cover',
                      flexShrink: 0
                    }}
                  />

                  <span
                    style={{
                      fontWeight: 'bold',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {teamName}
                  </span>
                </div>

                {[0, 1, 2, 3].map(
                  (positionIndex) => {

                    const selected =
                      currentPosition ===
                      positionIndex

                    return (

                      <button
                        key={positionIndex}
                        type="button"
                        disabled={locked}
                        onClick={() =>
                          onSelectPosition(
                            teamName,
                            positionIndex
                          )
                        }
                        aria-label={`${teamName} em ${positionIndex + 1} lugar`}
                        style={{
                          height: '48px',
                          borderRadius: '12px',
                          border:
                            selected
                              ? '1px solid #00ff9d'
                              : '1px solid rgba(255,255,255,0.08)',
                          background:
                            selected
                              ? 'rgba(0,255,157,0.14)'
                              : 'rgba(255,255,255,0.03)',
                          color:
                            selected
                              ? '#00ff9d'
                              : 'white',
                          cursor:
                            locked
                              ? 'default'
                              : 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        {selected ? 'X' : ''}
                      </button>

                    )

                  }
                )}

              </div>

            )

          }
        )}

      </div>

    </div>

  )

}

export default function GruposPage() {

  const [mobile, setMobile] =
    useState(false)

  const [groups, setGroups] =
    useState<GroupsState>({})

  const [teamsData, setTeamsData] =
    useState<Team[]>([])

  const [userId, setUserId] =
    useState<string | null>(null)

  const [agora, setAgora] =
    useState(() => Date.now())

  const [editMode, setEditMode] =
    useState<EditMode>('table')

  const bloqueado =
    agora >= DIVULGACAO_GRUPOS

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

    const relogio =
      window.setInterval(
        () => {
          setAgora(Date.now())
        },
        15000
      )

    const carregar =
      async () => {

        const { data: authData } =
          await supabase.auth.getUser()

        if (authData.user)
          setUserId(authData.user.id)

        const { data: teams } =
          await supabase
            .from('teams')
            .select('*')
            .order('nome')

        if (!teams)
          return

        setTeamsData(teams)

        const agrupados: GroupsState = {}

        teams.forEach(
          (team: Team) => {
            const groupName =
              team.group_name || ''

            if (!groupName)
              return

            if (!agrupados[groupName])
              agrupados[groupName] = []

            agrupados[groupName].push(
              team.nome
            )
          }
        )

        if (authData.user) {

          const { data: predictions } =
            await supabase
              .from('group_predictions')
              .select('*')
              .eq(
                'user_id',
                authData.user.id
              )

          predictions?.forEach(
            (prediction: any) => {
              agrupados[
                prediction.group_name
              ] = [
                prediction.first_place,
                prediction.second_place,
                prediction.third_place,
                prediction.fourth_place
              ].filter(Boolean)
            }
          )

        }

        setGroups(agrupados)

      }

    carregar()

    return () => {
      window.removeEventListener(
        'resize',
        checkMobile
      )
      window.clearInterval(relogio)
    }

  }, [])

  const handleDragEnd =
    (
      event: any,
      groupName: string
    ) => {

      if (isGruposBloqueado())
        return

      const { active, over } = event

      if (
        !over ||
        active.id === over.id
      )
        return

      const items =
        groups[groupName] || []

      const oldIndex =
        items.indexOf(active.id)

      const newIndex =
        items.indexOf(over.id)

      setGroups({
        ...groups,
        [groupName]:
          arrayMove(
            items,
            oldIndex,
            newIndex
          )
      })

    }

  const handleSelectPosition =
    (
      groupName: string,
      teamName: string,
      positionIndex: number
    ) => {

      if (isGruposBloqueado())
        return

      const items =
        [...(groups[groupName] || [])]

      const currentIndex =
        items.indexOf(teamName)

      if (
        currentIndex === -1 ||
        currentIndex === positionIndex
      )
        return

      const occupyingTeam =
        items[positionIndex]

      items[positionIndex] = teamName
      items[currentIndex] = occupyingTeam

      setGroups({
        ...groups,
        [groupName]: items
      })

    }

  const salvar =
    async () => {

      if (isGruposBloqueado()) {
        setAgora(Date.now())
        alert(
          'Os palpites dos grupos ja foram divulgados e nao podem mais ser alterados.'
        )
        return
      }

      if (!userId) {
        alert(
          'Faça login novamente para salvar seus grupos.'
        )
        return
      }

      for (const group of ORDEM_GRUPOS) {

        const teams =
          groups[group]

        if (
          !teams ||
          teams.length < 4
        )
          continue

        const payload = {
          user_id: userId,
          group_name: group,
          first_place: teams[0],
          second_place: teams[1],
          third_place: teams[2],
          fourth_place: teams[3]
        }

        const {
          data: existente,
          error: buscaError
        } =
          await supabase
            .from('group_predictions')
            .select('id')
            .eq('user_id', userId)
            .eq('group_name', group)
            .maybeSingle()

        if (buscaError) {
          alert(
            `Erro ao buscar grupo ${group}: ${buscaError.message}`
          )
          return
        }

        const query =
          existente?.id
            ? supabase
              .from('group_predictions')
              .update(payload)
              .eq('id', existente.id)
            : supabase
              .from('group_predictions')
              .insert(payload)

        const { error } =
          await query

        if (error) {
          alert(
            `Erro ao salvar grupo ${group}: ${error.message}`
          )
          return
        }

      }

      alert('Grupos salvos!')

    }

  const gruposOrdenados =
    ORDEM_GRUPOS.filter(
      (group) =>
        groups[group]
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
              maxWidth: '560px',
              lineHeight: 1.5
            }}
          >
            {bloqueado
              ? 'Seus palpites estão travados após a divulgação.'
              : 'Arraste as seleções para montar sua classificação da fase de grupos.'}
          </p>

        </section>

        {bloqueado && (

          <div
            style={{
              marginBottom: '22px',
              borderRadius: '16px',
              border:
                '1px solid rgba(255,80,80,0.2)',
              background:
                'rgba(255,80,80,0.06)',
              padding: '18px',
              textAlign: 'center',
              color: '#ff8080',
              fontWeight: 'bold'
            }}
          >
            Palpites encerrados. A edição e o salvamento foram bloqueados.
          </div>

        )}

        {!bloqueado && (

          <div
            style={{
              display: 'flex',
              justifyContent:
                mobile
                  ? 'stretch'
                  : 'flex-start',
              gap: '8px',
              marginBottom: '18px',
              maxWidth: '520px'
            }}
          >

            {[
              ['table', 'Tabela'],
              ['drag', 'Arrastar']
            ].map(
              ([mode, label]) => {

                const active =
                  editMode === mode

                return (

                  <button
                    key={mode}
                    type="button"
                    onClick={() =>
                      setEditMode(
                        mode as EditMode
                      )
                    }
                    style={{
                      flex:
                        mobile
                          ? 1
                          : 'initial',
                      height: '44px',
                      padding: '0 18px',
                      borderRadius: '14px',
                      border:
                        active
                          ? '1px solid #00ff9d'
                          : '1px solid rgba(255,255,255,0.08)',
                      background:
                        active
                          ? 'rgba(0,255,157,0.12)'
                          : 'rgba(255,255,255,0.03)',
                      color:
                        active
                          ? '#00ff9d'
                          : 'white',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    {label}
                  </button>

                )

              }
            )}

          </div>

        )}

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

          {gruposOrdenados.map(
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
                  borderRadius: '20px',
                  overflow: 'hidden'
                }}
              >

                <div
                  style={{
                    height: '68px',
                    borderBottom:
                      '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 18px'
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
                        color: '#00ff9d'
                      }}
                    >
                      {groupName}
                    </span>
                  </h2>

                </div>

                <div
                  style={{
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    opacity:
                      bloqueado
                        ? 0.75
                        : 1
                  }}
                >

                  {editMode === 'table' ? (

                    <GroupPositionGrid
                      groupName={groupName}
                      orderedTeams={
                        groups[groupName] || []
                      }
                      allTeams={teamsData}
                      mobile={mobile}
                      locked={bloqueado}
                      onSelectPosition={
                        (
                          teamName,
                          positionIndex
                        ) =>
                          handleSelectPosition(
                            groupName,
                            teamName,
                            positionIndex
                          )
                      }
                    />

                  ) : (

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
                        groups[groupName]
                      }
                      strategy={
                        verticalListSortingStrategy
                      }
                    >

                      {groups[groupName]?.map(
                        (
                          team,
                          index
                        ) => (

                          <TeamRow
                            key={team}
                            id={team}
                            index={index}
                            mobile={mobile}
                            teamsData={teamsData}
                            locked={bloqueado}
                          />

                        )
                      )}

                    </SortableContext>

                    </DndContext>

                  )}

                </div>

              </div>

            )
          )}

        </section>

        {!bloqueado && (

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '28px'
            }}
          >

            <button
              onClick={salvar}
              style={{
                width: '100%',
                maxWidth: '720px',
                height: '58px',
                borderRadius: '16px',
                border: 'none',
                background:
                  'linear-gradient(90deg,#00ff9d,#00c3ff)',
                color: 'black',
                fontWeight: 'bold',
                fontSize: '13px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
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
