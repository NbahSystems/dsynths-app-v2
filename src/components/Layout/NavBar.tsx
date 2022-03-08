import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { isMobileOnly as isMobile } from 'react-device-detect'

import { Z_INDEX } from 'theme'
import { useIsDedicatedTheme } from 'hooks/useTheme'
import { useDarkModeManager } from 'state/user/hooks'

import Web3Network from 'components/Web3Network'
import Web3Status from 'components/Web3Status'
import { ThemeToggle, Search as SearchIcon } from 'components/Icons'
import { NavButton } from 'components/Button'
import RegistrarsModal from 'components/RegistrarsModal'
import Menu from './Menu'
import NavLogo from './NavLogo'

const Wrapper = styled.div`
  padding: 0px 2rem;
  height: 55px;
  align-items: center;
  background: ${({ theme }) => theme.bg2};
  border-bottom: ${({ theme }) => theme.border2};
  gap: 5px;
  z-index: ${Z_INDEX.fixed};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 0px 1.25rem;
  `};
`

const DefaultWrapper = styled(Wrapper)`
  display: flex;
  flex-flow: row nowrap;
  & > * {
    &:first-child {
      flex: 1;
    }
    &:last-child {
      flex: 1;
    }
  }
`

const MobileWrapper = styled(Wrapper)`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`

const Routes = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  gap: 5px;
`

const Items = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  gap: 5px;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    & > * {
      &:first-child {
        display: none;
      }
    }
  `}
  ${({ theme }) => theme.mediaWidth.upToMedium`
    & > * {
      display: none;
      &:last-child,
      &:nth-last-child(2) {
        display: flex;
      }
    }
  `}
`

const NavLink = styled.div<{
  active: boolean
}>`
  font-size: 1rem;
  padding: 0.25rem 1rem;
  text-align: center;
  color: ${({ theme }) => theme.text2};
  font-weight: 500;

  ${({ active, theme }) =>
    active &&
    `
    pointer-events: none;
    text-decoration: underline;
    text-decoration-color: ${theme.primary2};
    text-underline-offset: 6px;
  `};

  &:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.primary1};
  }
`

const SearchText = styled.div`
  font-size: 0.8rem;
  margin-right: 5px;
  color: ${({ theme }) => theme.text2};
`

export default function NavBar() {
  const router = useRouter()
  const [, toggleDarkMode] = useDarkModeManager()
  const [registrarModalOpen, setRegistrarModalOpen] = useState<boolean>(false)
  const isDedicatedTheme = useIsDedicatedTheme()

  const buildUrl = useCallback(
    (path: string) => {
      return isDedicatedTheme ? `/${path}?theme=${router.query.theme}` : `/${path}`
    },
    [router, isDedicatedTheme]
  )

  function getMobileContent() {
    return (
      <MobileWrapper>
        <NavLogo />
        <Web3Status />
        <Menu />
      </MobileWrapper>
    )
  }

  function getDefaultContent() {
    return (
      <DefaultWrapper>
        <NavLogo />
        <Routes>
          <Link href={buildUrl('trade')} passHref>
            <NavLink active={router.route === '/trade'}>Trade</NavLink>
          </Link>
          <Link href={buildUrl('markets')} passHref>
            <NavLink active={router.route === '/markets'}>Markets</NavLink>
          </Link>
          <Link href={buildUrl('portfolio')} passHref>
            <NavLink active={router.route === '/portfolio'}>Portfolio</NavLink>
          </Link>
        </Routes>
        <Items>
          <NavButton onClick={() => setRegistrarModalOpen(true)}>
            <SearchText>Search for a ticker</SearchText>
            <SearchIcon size={20} />
          </NavButton>
          {!isDedicatedTheme && (
            <NavButton onClick={() => toggleDarkMode()}>
              <ThemeToggle size={20} />
            </NavButton>
          )}
          <Web3Network />
          <Web3Status />
          <Menu />
        </Items>
      </DefaultWrapper>
    )
  }

  return (
    <>
      {isMobile ? getMobileContent() : getDefaultContent()}
      <RegistrarsModal isOpen={registrarModalOpen} onDismiss={() => setRegistrarModalOpen(false)} />
    </>
  )
}
