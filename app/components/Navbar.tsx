'use client'

import Link from 'next/link'

import {
  Home,
  Trophy,
  Swords,
  Scale,
  Group
} from 'lucide-react'

import { useEffect, useState } from 'react'

import { usePathname } from 'next/navigation'

import { supabase } from '../../lib/supabase'

export default function Navbar() {

  const [iniciais, setIniciais] =
  useState('')

  const pathname =
    usePathname()

  const [mobile, setMobile] =
    useState(false)

  const [nome, setNome] =
    useState('U')

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

        const { data: profile } =
          await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single()

        if (profile?.nome)
          setNome(profile.nome)

if (profile.iniciais)
  setIniciais(
    profile.iniciais
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

  /* LOGOUT */

  const logout =
    async () => {

      await supabase.auth.signOut()

      window.location.href =
        '/login'

    }

  return (

    <>

      <aside
        style={{
          position: 'fixed',

          left:
            mobile
              ? '0'
              : '16px',

          bottom:
            mobile
              ? '0'
              : '16px',

          top:
            mobile
              ? 'auto'
              : '16px',

          width:
            mobile
              ? '100%'
              : '92px',

          height:
            mobile
              ? '78px'
              : 'calc(100vh - 32px)',

          background:
            'rgba(0,0,0,0.45)',

          backdropFilter:
            'blur(20px)',

          border:
            '1px solid rgba(255,255,255,0.06)',

          borderRadius:
            mobile
              ? '22px 22px 0 0'
              : '26px',

          display: 'flex',

          flexDirection:
            mobile
              ? 'row'
              : 'column',

          alignItems: 'center',

          justifyContent:
            mobile
              ? 'space-around'
              : 'space-between',

          padding:
            mobile
              ? '0 12px'
              : '18px 0',

          zIndex: 999
        }}
      >

        {/* TOPO */}

        <div
          style={{
            display: 'flex',

            flexDirection:
              mobile
                ? 'row'
                : 'column',

            alignItems: 'center',

            gap: '12px',

            overflowY: 'auto',

            paddingBottom:
              mobile
                ? '0'
                : '12px'
          }}
        >

          {/* HOME */}

          <Link
            href="/"

            style={{
              width:
                mobile
                  ? '58px'
                  : '72px',

              height:
                mobile
                  ? '58px'
                  : '72px',

              borderRadius: '18px',

              background:
                pathname === '/'
                  ? 'rgba(0,255,157,0.12)'
                  : 'transparent',

              border:
                pathname === '/'
                  ? '1px solid rgba(0,255,157,0.22)'
                  : '1px solid transparent',

              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',

              gap: '6px',

              color:
                pathname === '/'
                  ? '#00ff9d'
                  : 'rgba(255,255,255,0.7)',

              textDecoration: 'none'
            }}
          >

           <div
            style={{
              width: '58px',
              height: '58px',

              borderRadius: '16px',

              border:
                '1px solid rgba(255,255,255,0.08)',

              background:
                'rgba(255,255,255,0.03)',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Home size={24} />

  <div
    style={{
      position: 'absolute',

      top: '-6px',
      left: '1px',

      width: '12px',
      height: '12px',

      borderTop:
        `2px solid ${
          pathname === '/'
            ? '#00ff9d'
            : 'rgba(255,255,255,0.7)'
        }`,

      borderLeft:
        `2px solid ${
          pathname === '/'
            ? '#00ff9d'
            : 'rgba(255,255,255,0.7)'
        }`,

      transform:
        'rotate(45deg)'
    }}
  />

</div>

            <span
              style={{
                fontSize:
                  mobile
                    ? '9px'
                    : '10px',

                fontWeight: 'bold'
              }}
            >
              Home
            </span>

          </Link>

          {/* JOGOS */}

          <Link
            href="/jogos"

            style={{
              width:
                mobile
                  ? '58px'
                  : '72px',

              height:
                mobile
                  ? '58px'
                  : '72px',

              borderRadius: '18px',

              background:
                pathname === '/jogos'
                  ? 'rgba(0,255,157,0.12)'
                  : 'transparent',

              border:
                pathname === '/jogos'
                  ? '1px solid rgba(0,255,157,0.22)'
                  : '1px solid transparent',

              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',

              gap: '6px',

              color:
                pathname === '/jogos'
                  ? '#00ff9d'
                  : 'rgba(255,255,255,0.7)',

              textDecoration: 'none'
            }}
          >

            <div
            style={{
              width: '58px',
              height: '58px',

              borderRadius: '16px',

              border:
                '1px solid rgba(255,255,255,0.08)',

              background:
                'rgba(255,255,255,0.03)',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Swords size={24} />
          </div>

            <span
              style={{
                fontSize:
                  mobile
                    ? '9px'
                    : '10px',

                fontWeight: 'bold'
              }}
            >
              Jogos
            </span>

          </Link>

          {/* RANKING */}

          <Link
            href="/ranking"

            style={{
              width:
                mobile
                  ? '58px'
                  : '72px',

              height:
                mobile
                  ? '58px'
                  : '72px',

              borderRadius: '18px',

              background:
                pathname === '/ranking'
                  ? 'rgba(0,255,157,0.12)'
                  : 'transparent',

              border:
                pathname === '/ranking'
                  ? '1px solid rgba(0,255,157,0.22)'
                  : '1px solid transparent',

              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',

              gap: '6px',

              color:
                pathname === '/ranking'
                  ? '#00ff9d'
                  : 'rgba(255,255,255,0.7)',

              textDecoration: 'none'
            }}
          >

           <div
            style={{
              width: '58px',
              height: '58px',

              borderRadius: '16px',

              border:
                '1px solid rgba(255,255,255,0.08)',

              background:
                'rgba(255,255,255,0.03)',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Trophy size={24} />
          </div>
		  
		

            <span
              style={{
                fontSize:
                  mobile
                    ? '9px'
                    : '10px',

                fontWeight: 'bold'
              }}
            >
              Ranking
            </span>

          </Link>

          {/* PLACARES */}

          <Link
            href="/palpites-publicos"

            style={{
              width:
                mobile
                  ? '58px'
                  : '72px',

              height:
                mobile
                  ? '58px'
                  : '72px',

              borderRadius: '18px',

              background:
                pathname === '/palpites-publicos'
                  ? 'rgba(0,255,157,0.12)'
                  : 'transparent',

              border:
                pathname === '/palpites-publicos'
                  ? '1px solid rgba(0,255,157,0.22)'
                  : '1px solid transparent',

              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',

              gap: '6px',

              color:
                pathname === '/palpites-publicos'
                  ? '#00ff9d'
                  : 'rgba(255,255,255,0.7)',

              textDecoration: 'none',

              flexShrink: 0
            }}
          >

            {/* ÍCONE */}
<div
            style={{
              width: '58px',
              height: '58px',

              borderRadius: '16px',

              border:
                '1px solid rgba(255,255,255,0.08)',

              background:
                'rgba(255,255,255,0.03)',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Scale size={24} />
          </div>

            <span
              style={{
                fontSize:
                  mobile
                    ? '8px'
                    : '10px',

                fontWeight: 'bold'
              }}
            >
              Placares
            </span>

          </Link>

          {/* GRUPOS */}

<Link
  href="/grupos"

  style={{
    width:
      mobile
        ? '58px'
        : '72px',

    height:
      mobile
        ? '58px'
        : '72px',

    borderRadius: '18px',

    background:
      pathname === '/grupos'
        ? 'rgba(0,255,157,0.12)'
        : 'transparent',

    border:
      pathname === '/grupos'
        ? '1px solid rgba(0,255,157,0.22)'
        : '1px solid transparent',

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',

    gap: '6px',

    color:
      pathname === '/grupos'
        ? '#00ff9d'
        : 'rgba(255,255,255,0.7)',

    textDecoration: 'none',

    flexShrink: 0
  }}
>

  {/* ÍCONE */}

  <div
    style={{
      width: '58px',
      height: '58px',

      borderRadius: '16px',

      border:
        pathname === '/grupos'
          ? '1px solid rgba(0,255,157,0.25)'
          : '1px solid rgba(255,255,255,0.08)',

      background:
        pathname === '/grupos'
          ? 'rgba(0,255,157,0.08)'
          : 'rgba(255,255,255,0.03)',

      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <Group
      size={24}

      strokeWidth={2.2}

      color={
        pathname === '/grupos'
          ? '#00ff9d'
          : 'white'
      }
    />
  </div>

  {/* TEXTO */}

  <span
    style={{
      fontSize:
        mobile
          ? '8px'
          : '10px',

      fontWeight: 'bold'
    }}
  >
    Grupos
  </span>

</Link>        

        </div>



        {/* BAIXO */}

        <div
          style={{
            display: 'flex',

            flexDirection:
              mobile
                ? 'row'
                : 'column',

            alignItems: 'center',

            gap: '12px'
          }}
        >

          {/* USER */}

          <Link
  href="/perfil"

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
      '999px',

    background:
      'rgba(0,255,157,0.12)',

    border:
      '1px solid rgba(0,255,157,0.22)',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    color: '#00ff9d',

    fontWeight: 'bold',

    fontSize:
      mobile
        ? '16px'
        : '18px',

    textDecoration: 'none'
  }}
>
  {iniciais}
</Link>

          {/* LOGOUT */}

          <button
            onClick={logout}

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
                '999px',

              background:
                'rgba(255,255,255,0.04)',

              border:
                '1px solid rgba(255,255,255,0.08)',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              cursor: 'pointer',

              color: 'white',

              fontSize: '18px'
            }}
          >
            ↪
          </button>

        </div>

      </aside>

    </>

  )

}