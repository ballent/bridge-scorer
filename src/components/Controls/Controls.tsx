import Plus from '../../assets/Plus'
import Reset from '../../assets/Reset'
import useScreenSizes from '../../hooks/useScreenSizes'
import './Controls.css'

interface ControlsProps {
  isGameOver: boolean
  setConfirmationModalVisible: (visible: boolean) => void
  setBidModalVisible: (visible: boolean) => void
}

const Controls = ({
  isGameOver,
  setConfirmationModalVisible,
  setBidModalVisible
}: ControlsProps) => {
  const { isMobile } = useScreenSizes()

  return (
    <div
      className={`controls-container ${isMobile ? null : 'padding-vertical'}`}
      style={isMobile ? { width: '90%' } : { width: '400px' }}
    >
      <button
        className={`control ${!isMobile ? 'button-padding' : null}`}
        style={isMobile ? { position: 'fixed', bottom: 25, left: 25, width: 50 } : {}}
        onClick={() => setConfirmationModalVisible(true)}
      >
        {!isMobile && 'Reset'}
        <Reset color={'white'} />
      </button>
      {!isGameOver && (
        <button
          className={`control ${!isMobile ? 'button-padding' : null}`}
          style={isMobile ? { position: 'fixed', bottom: 25, right: 25, width: 50 } : {}}
          onClick={() => setBidModalVisible(true)}
        >
          {!isMobile && 'Add bid '}
          <Plus color={'white'} />
        </button>
      )}
    </div>
  )
}

export default Controls
