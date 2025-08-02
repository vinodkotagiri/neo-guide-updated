//@ts-nocheck
import React, { useEffect, useState } from 'react'
import RightMenuIcons from './RightMenuIcons'
import DubAreaComponent from './DubAreaComponent'
import SubtitleAreaComponent from './SubtitleAreaComponent'
import ElementsAddComponent from './ElementsAddComponent'
import BlurOptions from './Elements/BlurOptions'
import RectangleOptions from './Elements/RectangleOptions'
import TextOptions from './Elements/TextOptions'
import ArrowOptions from './Elements/ArrowOptions'
import SpotlightOptions from './Elements/SpotlightOptions'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { setAddingElements } from '../../redux/features/videoSlice'
import { addArrow, addBlur, addRectangle, addSpotLight, addText, addZoom, setCurrentElement, TextElementState, ZoomElementState } from '../../redux/features/elementsSlice'
import ZoomOptions from './Elements/ZoomOptions'

const EditorSider = ({ playerRef }) => {
  const [rightActiveArea, setRightActiveArea] = useState(2)
  const { currentPlayTime, isDisabled } = useAppSelector(state => state.video)
  const { rectangles, blurs, texts, arrows, spotLights, zooms, currentElement, currentElementId } = useAppSelector(state => state.elements)
  const dispatch = useAppDispatch()
  function handleAddShape(shape: string) {
    if (shape == 'rectangle') {
      dispatch(setAddingElements(true))
      const rectData: RectangleElementState = {
        id: Date.now().toString(),
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        strokeColor: '#000000',
        strokeWidth: 1,
        cornerRadius: [1, 1, 1, 1],
        fillColor: 'transparent',
        startTime: currentPlayTime,
        endTime: currentPlayTime + 5
      }
      dispatch(addRectangle(rectData))
      dispatch(setCurrentElement('rectangle'))
    }
    if (shape == 'blur') {
      dispatch(setAddingElements(true))
      const blurData: BlurElementState = {
        id: Date.now().toString(),
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        blurRadius: 50,
        startTime: currentPlayTime,
        endTime: currentPlayTime + 5
      }
      dispatch(addBlur(blurData))
      dispatch(setCurrentElement({ id: blurData.id, type: 'blur' }))
    }
    if (shape == 'text') {
      dispatch(setAddingElements(true))
      const textData: TextElementState = {
        id: Date.now().toString(),
        x: 200,
        y: 200,
        text: 'Hello world',
        font: 'Open Sans',
        fontSize: 24,
        fontStyle:'normal',
        backgroundColor: 'transparent',
        backgroundGradientStartColor: 'transparent',
        backgroundGradientEndColor: 'transparent',
        gradientDirection: 'horizontal',
        justify: 'center',
        fontColor: '#ffffff',
        backgroundType: 'solid',
        rotation: 0,
        startTime: currentPlayTime,
        endTime: currentPlayTime + 5,
        backgroundWidth: 100,
        backgroundHeight: 24,
      }
      dispatch(addText(textData))
      dispatch(setCurrentElement('text'))
    }
    if (shape == 'arrow') {
      dispatch(setAddingElements(true))
      const arrowData: ArrowElementState = {
        id: Date.now().toString(),
        x: 0,
        y: 0,
        points: [0, 0, 100, 100],
        strokeWidth: 4,
        stroke: 'red',
        pointerLength: 20,
        rotation: 0,
        pointerWidth: 20,
        startTime: currentPlayTime,
        endTime: currentPlayTime + 5
      }
      dispatch(addArrow(arrowData))
      dispatch(setCurrentElement('arrow'))
    }
    if (shape === 'spotlight') {
      dispatch(setAddingElements(true));

      const spotlightData: SpotElementElementState = {
        id: Date.now().toString(),
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        glowColor: '#00ffff',
        glowRadius: 50,
        cornerRadius: [20, 20, 20, 20],
        startTime: currentPlayTime,
        endTime: currentPlayTime + 5
      };

      dispatch(addSpotLight(spotlightData));
      dispatch(setCurrentElement('spotlight'));
    }
    if (shape == 'zoom') {
      dispatch(setAddingElements(true))
      const zoomData: ZoomElementState = {
        id: Date.now().toString(),
        zoom_factor: 1.5,
        easing_factor: 0.2,
        start_time: currentPlayTime,
        end_time: currentPlayTime + 5,
        roi: { x: 100, y: 100, width: 100, height: 100 }
      }
      dispatch(addZoom(zoomData))
      dispatch(setCurrentElement('zoom'))
    }
  }

  useEffect(() => {
    if (rightActiveArea == 4 && blurs.length == 0) {
      handleAddShape('blur')
    }
    else if (rightActiveArea == 5 && rectangles.length == 0) {
      handleAddShape('rectangle')
    }
    else if (rightActiveArea == 6 && texts.length == 0) {
      handleAddShape('text')
    }
    else if (rightActiveArea == 7 && arrows.length == 0) {
      handleAddShape('arrow')
    }
    else if (rightActiveArea == 8 && spotLights.length == 0) {
      handleAddShape('spotlight')
    }
    else if (rightActiveArea == 9 && zooms.length == 0) {
      handleAddShape('zoom')
    }
  }, [rightActiveArea])

  useEffect(() => {
    if (currentElementId) {
      if (currentElement == 'rectangle' && rightActiveArea != 5) {
        setRightActiveArea(5)
      }
      if (currentElement == 'blur' && rightActiveArea != 4) {
        setRightActiveArea(4)
      }
      if (currentElement == 'text' && rightActiveArea != 6) {
        setRightActiveArea(6)
      }
      if (currentElement == 'arrow' && rightActiveArea != 7) {
        setRightActiveArea(7)
      }
      if (currentElement == 'spotlight' && rightActiveArea != 8) {
        setRightActiveArea(8)
      }
      if (currentElement == 'zoom' && rightActiveArea != 8) {
        setRightActiveArea(9)
      }
    }
  }, [currentElement, currentElementId])

  return (
    <div className='w-full h-full  bg-[#16151a] border-[1px] border-[#303032] rounded-tl-2xl flex z-50   '>
      <>
          <div className='w-[calc(100%-56px)] text-slate-600  h-full    '>
            {rightActiveArea == 1 && <DubAreaComponent />}
            {rightActiveArea == 2 && <SubtitleAreaComponent playerRef={playerRef} />}
            {rightActiveArea == 4 && <BlurOptions playerRef={playerRef} />}
            {rightActiveArea == 5 && <RectangleOptions playerRef={playerRef} />}
            {rightActiveArea == 6 && <TextOptions playerRef={playerRef} />}
            {rightActiveArea == 7 && <ArrowOptions playerRef={playerRef} />}
            {rightActiveArea == 8 && <SpotlightOptions playerRef={playerRef} />}
            {rightActiveArea == 9 && <ZoomOptions playerRef={playerRef} />}
          </div>
          <div className='w-[60px] h-full border-[#303032] border-l'>
            <RightMenuIcons setRightActiveArea={setRightActiveArea} rightActiveArea={rightActiveArea} />
          </div>
        </>
    </div>
  )
}

export default EditorSider