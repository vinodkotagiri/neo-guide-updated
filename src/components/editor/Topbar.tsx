import logo from '@/assets/logos/logo.png'
function Topbar() {
  return (
    <div className="h-12 w-full flex items-center justify-between p-2 ">
      <div className="flex items-center justify-between gap-4">
        <img src={logo} alt='logo' width={32} height={32} />
        <div className='text-slate-400 text-sm'>Untitiled</div>
      </div>
    </div>
  )
}

export default Topbar