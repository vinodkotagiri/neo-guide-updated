import { FaCloudUploadAlt } from "react-icons/fa";
import IconButton from "./IconButton";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { setActiveMenu, setIsRecording, setIsUploading } from "@/app/features/workingSlice";
import { BsFillRecordBtnFill } from "react-icons/bs";
import { useSelector } from "react-redux";

function SidebarIconsMenu() {
  const { activeMenuButton } = useSelector((state: RootState) => state.working)
  const dispatch = useDispatch<AppDispatch>();

  function showUploadModal() {
    dispatch(setIsUploading(true))
    dispatch(setActiveMenu('upload'))
  }

  function showRecordModal() {
    dispatch(setIsRecording(true))
    dispatch(setActiveMenu('record'))
  }

  return (
    <div className="w-12 h-full flex items-center flex-col z-10 border-t-1 border-slate-700">
      <IconButton label='Upload' onClick={showUploadModal} Icon={FaCloudUploadAlt} isActive={activeMenuButton == 'upload'} />
      <IconButton label='Record Screen' onClick={showRecordModal} Icon={BsFillRecordBtnFill} isActive={activeMenuButton == 'record'} />
    </div>
  )
}

export default SidebarIconsMenu