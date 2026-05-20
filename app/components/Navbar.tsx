'use client'

import {
  Home,
  Trophy,
  Swords,
  Group,
  Ungroup,
  LayoutPanelTop,
  LogOut
} from 'lucide-react'

import {
  usePathname,
  useRouter
} from 'next/navigation'

import {
  useEffect,
  useState
} from 'react'

import { supabase }
from '../../lib/supabase'

export default function Navbar() {

  const router =
    useRouter()

  const pathname =
    usePathname()

  const [mobile, setMobile] =
    useState(false)

  const [iniciais, setIniciais] =
    useState('??')

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

    const carregarPerfil =
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
            .select('iniciais')
            .eq(
              'id',
              authData.user.id
            )
            .single()

        if (
          profile?.iniciais
        ) {

          setIniciais(
            profile.iniciais
          )

        }

      }

    carregarPerfil()

    return () => {

      window.removeEventListener(
        'resize',
        checkMobile
      )

    }

  }, [])

  const sair =
    async () => {

      await supabase.auth
        .signOut()

      router.replace(
        '/login'
      )

    }

  const itemStyle = (
    active: boolean
  ) => ({

    display: 'flex',

    flexDirection:
      'column' as const,

    alignItems:
      'center' as const,

    gap:
      mobile
        ? '3px'
        : '6px',

    cursor: 'pointer'
  })

  const iconBoxStyle = (
    active: boolean
  ) => ({

    width:
      mobile
        ? '40px'
        : '58px',

    height:
      mobile
        ? '40px'
        : '58px',

    borderRadius:
      mobile
        ? '12px'
        : '16px',

    border: active

      ? '1px solid rgba(0,255,157,0.35)'

      : '1px solid rgba(255,255,255,0.08)',

    background: active

      ? 'rgba(0,255,157,0.10)'

      : 'rgba(255,255,255,0.03)',

    display: 'flex',

    alignItems:
      'center' as const,

    justifyContent:
      'center' as const,

    transition:
      '0.2s'
  })

  const textStyle = (
    active: boolean
  ) => ({

    fontSize:
      mobile
        ? '9px'
        : '12px',

    color: active

      ? '#00ff9d'

      : 'rgba(255,255,255,0.75)',

    fontWeight: 'bold'
  })

  return (

    <nav
      style={{

        position: 'fixed',

        bottom:
          mobile
            ? 0
            : 'unset',

        top:
          mobile
            ? 'unset'
            : 0,

        left: 0,

        right:
          mobile
            ? 0
            : 'unset',

        width:
          mobile
            ? '100%'
            : '92px',

        height:
          mobile
            ? '78px'
            : '100vh',

        background:
          'rgba(0,0,0,0.72)',

        backdropFilter:
          'blur(18px)',

        borderRight:
          mobile
            ? 'none'
            : '1px solid rgba(255,255,255,0.06)',

        borderTop:
          mobile
            ? '1px solid rgba(255,255,255,0.06)'
            : 'none',

        display: 'flex',

        flexDirection:
          mobile
            ? 'row'
            : 'column',

        alignItems:
          'center',

        justifyContent:
          'space-between',

        padding:
          mobile
            ? '6px 4px'
            : '18px 0',

        zIndex: 9999
      }}
    >

      {/* MENU */}

      <div
        style={{

          display: 'flex',

          flexDirection:
            mobile
              ? 'row'
              : 'column',

          alignItems:
            'center',

          justifyContent:
            'center',

          gap:
            mobile
              ? '2px'
              : '14px',

          width: '100%'
        }}
      >

        {/* HOME */}

        <div
          onClick={() =>
            router.push('/')
          }

          style={
            itemStyle(
              pathname === '/'
            )
          }
        >

          <div
            style={
              iconBoxStyle(
                pathname === '/'
              )
            }
          >

            <Home
              size={
                mobile
                  ? 16
                  : 24
              }

              color={
                pathname === '/'

                  ? '#00ff9d'

                  : 'white'
              }
            />

          </div>

          <span
            style={
              textStyle(
                pathname === '/'
              )
            }
          >
            HOME
          </span>

        </div>

        {/* JOGOS */}

        <div
          onClick={() =>
            router.push('/jogos')
          }

          style={
            itemStyle(
              pathname === '/jogos'
            )
          }
        >

          <div
            style={
              iconBoxStyle(
                pathname === '/jogos'
              )
            }
          >

            <Swords
              size={
                mobile
                  ? 16
                  : 24
              }

              color={
                pathname ===
                '/jogos'

                  ? '#00ff9d'

                  : 'white'
              }
            />

          </div>

          <span
            style={
              textStyle(
                pathname ===
                '/jogos'
              )
            }
          >
            JOGOS
          </span>

        </div>

        {/* RANKING */}

        <div
          onClick={() =>
            router.push(
              '/ranking'
            )
          }

          style={
            itemStyle(
              pathname ===
              '/ranking'
            )
          }
        >

          <div
            style={
              iconBoxStyle(
                pathname ===
                '/ranking'
              )
            }
          >

            <Trophy
              size={
                mobile
                  ? 16
                  : 24
              }

              color={
                pathname ===
                '/ranking'

                  ? '#00ff9d'

                  : 'white'
              }
            />

          </div>

          <span
            style={
              textStyle(
                pathname ===
                '/ranking'
              )
            }
          >
            RANK
          </span>

        </div>

        {/* PALPITES */}

        <div
          onClick={() =>
            router.push(
              '/palpites-publicos'
            )
          }

          style={
            itemStyle(
              pathname ===
              '/palpites-publicos'
            )
          }
        >

          <div
            style={
              iconBoxStyle(
                pathname ===
                '/palpites-publicos'
              )
            }
          >

            <LayoutPanelTop
              size={
                mobile
                  ? 16
                  : 24
              }

              color={
                pathname ===
                '/palpites-publicos'

                  ? '#00ff9d'

                  : 'white'
              }
            />

          </div>

          <span
            style={
              textStyle(
                pathname ===
                '/palpites-publicos'
              )
            }
          >
            PALPITES
          </span>

        </div>

        {/* GRUPOS */}

        <div
          onClick={() =>
            router.push(
              '/grupos'
            )
          }

          style={
            itemStyle(
              pathname ===
              '/grupos'
            )
          }
        >

          <div
            style={
              iconBoxStyle(
                pathname ===
                '/grupos'
              )
            }
          >

            <Group
              size={
                mobile
                  ? 16
                  : 24
              }

              color={
                pathname ===
                '/grupos'

                  ? '#00ff9d'

                  : 'white'
              }
            />

          </div>

          <span
            style={
              textStyle(
                pathname ===
                '/grupos'
              )
            }
          >
            GRUPOS
          </span>

        </div>

        {/* CENTRAL GRUPOS */}

        <div
          onClick={() =>
            router.push(
              '/grupos-publicos'
            )
          }

          style={
            itemStyle(
              pathname ===
              '/grupos-publicos'
            )
          }
        >

          <div
            style={
              iconBoxStyle(
                pathname ===
                '/grupos-publicos'
              )
            }
          >

            <Ungroup
              size={
                mobile
                  ? 16
                  : 24
              }

              color={
                pathname ===
                '/grupos-publicos'

                  ? '#00ff9d'

                  : 'white'
              }
            />

          </div>

          <span
            style={
              textStyle(
                pathname ===
                '/grupos-publicos'
              )
            }
          >
            TABELA
          </span>

        </div>

      </div>

      {/* PERFIL */}

      <div
        style={{
          display: 'flex',

          flexDirection:
            mobile
              ? 'row'
              : 'column',

          alignItems:
            'center',

          gap:
            mobile
              ? '4px'
              : '12px'
        }}
      >

        <div
          onClick={() =>
            router.push(
              '/perfil'
            )
          }

          style={{
            width:
              mobile
                ? '40px'
                : '52px',

            height:
              mobile
                ? '40px'
                : '52px',

            borderRadius:
              '999px',

            border:
              '1px solid rgba(0,255,157,0.25)',

            background:
              'rgba(0,255,157,0.08)',

            display: 'flex',

            alignItems:
              'center',

            justifyContent:
              'center',

            color: '#00ff9d',

            fontWeight: 'bold',

            fontSize:
              mobile
                ? '11px'
                : '14px',

            cursor: 'pointer',

            flexShrink: 0
          }}
        >
          {iniciais}
        </div>

        <div
          onClick={sair}

          style={{
            width:
              mobile
                ? '40px'
                : '52px',

            height:
              mobile
                ? '40px'
                : '52px',

            borderRadius:
              mobile
                ? '12px'
                : '16px',

            border:
              '1px solid rgba(255,255,255,0.08)',

            background:
              'rgba(255,255,255,0.03)',

            display: 'flex',

            alignItems:
              'center',

            justifyContent:
              'center',

            cursor: 'pointer'
          }}
        >

          <LogOut
            size={
              mobile
                ? 16
                : 22
            }

            color="white"
          />

        </div>

      </div>

    </nav>

  )

}