import { IconButtonProps } from '@/lib/interfaces/editor'
import { motion } from 'framer-motion'
import { Tooltip } from 'react-tooltip'

function IconButton(props: IconButtonProps) {
  const { Icon, label, onClick, isActive } = props

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.1 }} // Scale up on hover for better interactivity
      className={`cursor-pointer p-2  transition-all duration-200 ${
        isActive ? 'bg-slate-800 text-blue-400 opacity-95' : 'text-slate-400 hover:bg-slate-800'
      }`}
      onClick={onClick}
      data-tooltip-id="icon-tooltip"
      data-tooltip-content={label}
    >
      <Icon size={28} />
      <Tooltip id="icon-tooltip" />
    </motion.button>
  )
}

export default IconButton
