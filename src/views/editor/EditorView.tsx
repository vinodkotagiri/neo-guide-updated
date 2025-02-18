import Topbar from "@/components/editor/Topbar"
import SidebarIConsMenu from "@/components/editor/SidebarIconsMenu"
import Sidebar from "@/components/editor/Sidebar"
import PlayerArea from "@/components/editor/PlayerArea"
import TimelineArea from "@/components/editor/TimelineArea"
import UploadDialouge from "@/components/editor/UploadDialouge"
import RecordDialouge from "@/components/editor/RecordDialouge"

function EditorView() {
  return (
    <div className="w-dvw h-dvh bg-zinc-900 relative overflow-hidden">
      <UploadDialouge />
      <RecordDialouge/>
      <Topbar />
      <div className="flex w-full h-[calc(100%-48px)]">
        <SidebarIConsMenu />
        <div className="flex w-full gap-1">
        <Sidebar />
        <div className="flex-1 h-[calc(100%-8px)] mb-2 flex flex-col pr-2 gap-2 rounded-md overflow-hidden">
          <div className="h-4/6 w-full">
          <PlayerArea />
          </div>
          <div className="h-2/6 w-full">
          <TimelineArea />
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default EditorView