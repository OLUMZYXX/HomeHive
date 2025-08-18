import Tooltip from './Tooltip'

// Higher-order component for common tooltip patterns
export const withTooltip = (Component, tooltipProps) => {
  const WrappedComponent = (props) => (
    <Tooltip {...tooltipProps}>
      <Component {...props} />
    </Tooltip>
  )

  WrappedComponent.displayName = `withTooltip(${
    Component.displayName || Component.name
  })`
  return WrappedComponent
}
