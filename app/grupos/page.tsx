'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import {
  DndContext,
  closestCenter
} from '@dnd-kit/core'

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove
} from '@dnd-kit/sortable'

import {
  CSS
} from '@dnd-kit/utilities'

import { supabase } from '../../lib/supabase'

import Navbar from '../components/Navbar'

function SortableItem({
  team
}: any) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: team.nome
  })

  const style = {

    transform:
      CSS.Transform.toString(
        transform
      ),

    transition

  }

  return (

    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="
        h-14
        border
        border-white/10
        bg-white/[0.03]
        hover:bg-white/[0.05]
        transition
        flex
        items-center
        justify-between
        px-4
        cursor-grab
        active:cursor-grabbing
      "
    >

      {/* ESQUERDA */}

      <div
        className="
          flex
          items-center
          gap-3
        "
      >

        <img
          src={`https://flagcdn.com/w320/${team.flag}.png`}
          className="
            w-7
            h-5
            object-cover
          "
        />

        <p
          className="
            text-sm
            font-medium
          "
        >
          {team.nome}
        </p>

      </div>

      {/* ÍCONE */}

      <div
        className="
          text-white/30
          text-lg
          leading-none
        "
      >
        ☰
      </div>

    </div>

  )

}

export default function Grupos() {

  const [perfil, setPerfil] =
    useState<any>(null)

  const [teams, setTeams] =
    useState<any[]>([])

  const [groups, setGroups] =
    useState<any>({})

  const bloqueado =
    new Date() >=
    new Date('2026-06-11T16:00:00')

  useEffect(() => {

    const carregar = async () => {

      const { data } =
        await supabase.auth.getUser()

      if (!data.user) return

      const user = data.user

      /* PERFIL */

      const { data: meuPerfil } =
        await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

      if (meuPerfil) {
        setPerfil(meuPerfil)
      }

      /* TEAMS */

      const { data: teamsData } =
        await supabase
          .from('teams')
          .select('*')
          .order('nome')

      if (teamsData) {

        setTeams(teamsData)

        const gruposFormatados: any = {}

        const letras = [
          'A','B','C','D',
          'E','F','G','H',
          'I','J','K','L'
        ]

        letras.forEach((grupo) => {

          gruposFormatados[grupo] =
            teamsData.filter(
              (team) =>
                team.group_name === grupo
            )

        })

        /* BUSCAR PALPITES */

        const { data: predictions } =
          await supabase
            .from('group_predictions')
            .select('*')
            .eq('user_id', user.id)

        if (
          predictions &&
          predictions.length > 0
        ) {

          predictions.forEach((item) => {

            gruposFormatados[
              item.group_name
            ] = [

              teamsData.find(
                (t) =>
                  t.nome ===
                  item.first_place
              ),

              teamsData.find(
                (t) =>
                  t.nome ===
                  item.second_place
              ),

              teamsData.find(
                (t) =>
                  t.nome ===
                  item.third_place
              ),

              teamsData.find(
                (t) =>
                  t.nome ===
                  item.fourth_place
              )

            ].filter(Boolean)

          })

        }

        setGroups(
          gruposFormatados
        )

      }

    }

    carregar()

  }, [])

  /* DRAG */

  const handleDragEnd = (
    event: any,
    grupo: string
  ) => {

    const {
      active,
      over
    } = event

    if (
      !over ||
      active.id === over.id
    ) return

    const items =
      groups[grupo]

    const oldIndex =
      items.findIndex(
        (item: any) =>
          item.nome === active.id
      )

    const newIndex =
      items.findIndex(
        (item: any) =>
          item.nome === over.id
      )

    setGroups({

      ...groups,

      [grupo]:
        arrayMove(
          items,
          oldIndex,
          newIndex
        )

    })

  }

  /* SALVAR */

  const salvar =
    async () => {

      const { data } =
        await supabase.auth.getUser()

      if (!data.user) return

      const user = data.user

      for (const grupo in groups) {

        const lista =
          groups[grupo]

        if (
          lista.length !== 4
        ) continue

        await supabase
          .from('group_predictions')
          .upsert({

            user_id: user.id,

            group_name: grupo,

            first_place:
              lista[0]?.nome,

            second_place:
              lista[1]?.nome,

            third_place:
              lista[2]?.nome,

            fourth_place:
              lista[3]?.nome

          })

      }

      alert(
        'Grupos salvos!'
      )

    }

  const listaGrupos = [
    'A','B','C','D',
    'E','F','G','H',
    'I','J','K','L'
  ]

  return (

    <main
      className="
        min-h-screen
        py-8
      "
    >

      <Navbar
        nome={perfil?.nome || ''}
      />

      {/* TÍTULO */}

      <div className="text-center mb-16">

        <p
          className="
            text-white/50
            uppercase
            tracking-[0.35em]
            text-[10px]
            mb-4
          "
        >
          Copa do Mundo 2026
        </p>

        <h1
          className="
            text-4xl
            font-semibold
            tracking-tight
          "
        >
          Grupos
        </h1>

      </div>

      {/* GRID */}

      <div
        className="
          w-full
          flex
          justify-center
          px-4
        "
      >

        <div
          className="
            w-full
            max-w-7xl
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-3
            gap-5
          "
        >

          {listaGrupos.map((grupo) => (

            <section
              key={grupo}
              className="
                border
                border-white/[0.06]
                bg-white/[0.02]
                backdrop-blur-xl
                p-5
              "
            >

              {/* HEADER */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-5
                "
              >

                <div>

                  <p
                    className="
                      text-white/40
                      uppercase
                      tracking-[0.3em]
                      text-[9px]
                      mb-1
                    "
                  >
                    Grupo
                  </p>

                  <h2
                    className="
                      text-3xl
                      font-semibold
                    "
                  >
                    {grupo}
                  </h2>

                </div>

                <div
                  className="
                    text-white/20
                    text-5xl
                    font-bold
                  "
                >
                  {grupo}
                </div>

              </div>

              {/* LISTA */}

              <DndContext
                collisionDetection={
                  closestCenter
                }
                onDragEnd={(e) =>
                  handleDragEnd(
                    e,
                    grupo
                  )
                }
              >

                <SortableContext
                  items={
                    groups[grupo]
                      ?.map(
                        (t: any) =>
                          t.nome
                      ) || []
                  }
                  strategy={
                    verticalListSortingStrategy
                  }
                >

                  <div
                    className="
                      flex
                      flex-col
                      gap-2
                    "
                  >

                    {groups[grupo]
                      ?.map(
                        (
                          team: any,
                          index: number
                        ) => (

                        <div
                          key={team.nome}
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >

                          {/* POS */}

                          <div
                            className="
                              w-9
                              h-9
                              border
                              border-white/10
                              bg-black/20
                              flex
                              items-center
                              justify-center
                              text-xs
                              font-bold
                              text-white/50
                              shrink-0
                            "
                          >
                            {index + 1}°
                          </div>

                          {/* ITEM */}

                          <div className="w-full">

                            <SortableItem
                              team={team}
                            />

                          </div>

                        </div>

                      ))}

                  </div>

                </SortableContext>

              </DndContext>

            </section>

          ))}

        </div>

      </div>

      {/* BLOQUEADO */}

      {bloqueado && (

        <div className="text-center mt-10">

          <p
            className="
              text-red-400
              uppercase
              tracking-[0.2em]
              text-xs
            "
          >
            Palpites encerrados
          </p>

        </div>

      )}

      {/* SALVAR */}

      {!bloqueado && (

        <div
          className="
            flex
            justify-center
            mt-16
            px-4
          "
        >

          <button
            onClick={salvar}
            className="
              border
              border-white/10
              bg-white/[0.03]
              hover:bg-white/[0.06]
              transition
              px-8
              py-4
              text-sm
              uppercase
              tracking-[0.2em]
            "
          >
            Salvar grupos
          </button>

        </div>

      )}

      {/* BOTÕES */}

      <div
        className="
          w-full
          flex
          justify-center
          mt-24
          pb-20
          px-4
        "
      >

        <div
          className="
            w-full
            max-w-5xl
            grid
            grid-cols-3
            gap-2
          "
        >

          <Link
            href="/"
            className="
              w-full
              text-center
              border
              border-white/10
              bg-white/[0.03]
              hover:bg-white/[0.06]
              transition
              px-4
              py-4
              text-sm
              font-medium
            "
          >
            HOME
          </Link>

          <Link
            href="/jogos"
            className="
              w-full
              text-center
              border
              border-white/10
              bg-white/[0.03]
              hover:bg-white/[0.06]
              transition
              px-4
              py-4
              text-sm
              font-medium
            "
          >
            PALPITES
          </Link>

          <Link
            href="/ranking"
            className="
              w-full
              text-center
              border
              border-white/10
              bg-white/[0.03]
              hover:bg-white/[0.06]
              transition
              px-4
              py-4
              text-sm
              font-medium
            "
          >
            CLASSIFICAÇÃO
          </Link>

        </div>

      </div>

    </main>

  )

}