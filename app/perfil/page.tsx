'use client'

import { useEffect, useState }
from 'react'

import Navbar
from '../components/Navbar'

import { supabase }
from '../../lib/supabase'

export default function PerfilPage() {

  const [iniciais,
    setIniciais] =
      useState('')

  const [mobile,
    setMobile] =
      useState(false)

  useEffect(() => {

    const checkMobile =
      () => {

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
          await supabase.auth
            .getUser()

        if (!authData.user)
          return

        const {
          data: profile
        } =
          await supabase
            .from('profiles')
            .select('*')
            .eq(
              'id',
              authData.user.id
            )
            .single()

        if (profile) {

          setIniciais(
            profile.iniciais || ''
          )

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

  const salvar =
    async () => {

      const {
        data: authData
      } =
        await supabase.auth
          .getUser()

      if (!authData.user)
        return

      await supabase
        .from('profiles')
        .update({

          iniciais:
            iniciais
              .toUpperCase()

        })
        .eq(
          'id',
          authData.user.id
        )

      alert(
        'Perfil atualizado!'
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

          color: 'white'
        }}
      >

        <div
          style={{
            maxWidth: '520px',

            margin: '0 auto'
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
            PERFIL
          </p>

          <h1
            className="fifa-title"

            style={{
              fontSize:
                mobile
                  ? '52px'
                  : '72px',

              marginBottom: '22px'
            }}
          >
            SUAS{' '}

            <span
              style={{
                color: '#00ff9d'
              }}
            >
              INICIAIS
            </span>

          </h1>

          <div
            style={{
              border:
                '1px solid rgba(255,255,255,0.08)',

              background:
                'rgba(255,255,255,0.03)',

              borderRadius:
                '24px',

              padding: '22px'
            }}
          >

            <input
              value={iniciais}

              maxLength={3}

              onChange={(e) =>
                setIniciais(
                  e.target.value
                )
              }

              placeholder="GV"

              style={{
                width: '100%',

                height: '58px',

                borderRadius:
                  '16px',

                border:
                  '1px solid rgba(255,255,255,0.08)',

                background:
                  'rgba(255,255,255,0.03)',

                padding:
                  '0 18px',

                color: 'white',

                fontSize: '18px',

                outline: 'none'
              }}
            />

            <button
              onClick={salvar}

              style={{
                width: '100%',

                height: '58px',

                marginTop: '16px',

                borderRadius:
                  '16px',

                border: 'none',

                background:
                  'linear-gradient(90deg,#00ff9d,#00c3ff)',

                color: 'black',

                fontWeight:
                  'bold',

                cursor: 'pointer'
              }}
            >
              SALVAR
            </button>

          </div>

        </div>

      </main>

    </>

  )

}