// import React from 'react'
import PropTypes from 'prop-types'

const HomeHiveLogo = (props) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={props.width || 100}
    height={props.height || 100}
    viewBox='0 0 100 100'
    {...props}
  >
    {/* Modern house shape */}
    <rect x='20' y='40' width='60' height='45' rx='8' fill='url(#gradient6)' />
    {/* Roof */}
    <path
      d='M15 45 L50 15 L85 45 L75 45 L50 25 L25 45 Z'
      fill='url(#gradient7)'
    />
    {/* Door */}
    <rect x='42' y='60' width='16' height='25' rx='8' fill='white' />
    <circle cx='53' cy='72' r='2' fill='#1e293b' />
    {/* Windows */}
    <circle cx='32' cy='55' r='6' fill='white' />
    <circle cx='68' cy='55' r='6' fill='white' />
    <defs>
      <linearGradient id='gradient6' x1='0%' y1='0%' x2='100%' y2='100%'>
        <stop offset='0%' stopColor='#e2e8f0' />
        <stop offset='100%' stopColor='#cbd5e1' />
      </linearGradient>
      <linearGradient id='gradient7' x1='0%' y1='0%' x2='100%' y2='100%'>
        <stop offset='0%' stopColor='#1e293b' />
        <stop offset='100%' stopColor='#475569' />
      </linearGradient>
    </defs>
  </svg>
)
HomeHiveLogo.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

export default HomeHiveLogo
