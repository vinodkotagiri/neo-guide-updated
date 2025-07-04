// @ts-nocheck
import { useEffect, useRef, useState } from 'react';
import { MdOutlineFormatAlignCenter, MdOutlineFormatAlignJustify, MdOutlineFormatAlignLeft, MdOutlineFormatAlignRight } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { addText, changeBGType, deleteText, editText, setCurrentElement, setCurrentElementId, TextElementState } from '../../../redux/features/elementsSlice';
import { setAddingElements } from '../../../redux/features/videoSlice';
import { CiTextAlignJustify } from 'react-icons/ci';
import { RiFontColor } from 'react-icons/ri';
import { FaPlus, FaRegTrashAlt } from 'react-icons/fa';
import { TbBackground } from 'react-icons/tb';

const TextOptions = ({ playerRef }) => {
  const { currentElementId, texts, currentElement } = useAppSelector((state) => state.elements);
  const { currentPlayTime } = useAppSelector((state) => state.video);
  const dispatch = useAppDispatch();
  const [text, setText] = useState('');
  const [font, setFont] = useState('Open Sans');
  const [fontSize, setFontSize] = useState(24);
  const [fontColor, setFontColor] = useState('#000000');
  const [backgroundType, setBackgroundType] = useState('solid');
  const [backgroundColor, setBackgroundColor] = useState('transparent');
  const [gradientDirection, setGradientDirection] = useState('horizontal');
  const [backgroundGradientStartColor, setBackgroundGradientStartColor] = useState('#000000');
  const [backgroundGradientEndColor, setBackgroundGradientEndColor] = useState('#000000');
  const [justify, setJustify] = useState('center');
  const [rotation, setRotation] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [activeId, setActiveId] = useState(null);

  const fontColorInputRef = useRef(null);
  const backgroundColorInputRef = useRef(null);
  const gradientStartColorRef = useRef(null);
  const gradientEndColorRef = useRef(null);

  function handleClick(item) {
    dispatch(setCurrentElementId({ id: item.id, type: 'text' }));
    playerRef?.current?.seekTo(item.startTime);
    setActiveId(item.id);
  }

  // Sync state with selected text
  useEffect(() => {
    setActiveId(currentElementId);
    const currentText = texts.find((rect) => rect.id === currentElementId);
    if (currentText) {
      setText(currentText.text || '');
      setFont(currentText.font || 'Open Sans');
      setFontSize(currentText.fontSize);
      setFontColor(currentText.fontColor || '#000000');
      setJustify(currentText.justify || 'center');
      setRotation(currentText.rotation || 0);
      setStartTime(currentText.startTime || currentPlayTime);
      setEndTime(currentText.endTime || currentPlayTime + 5);
      setBackgroundType(currentText.backgroundType);
      setBackgroundColor(currentText.backgroundColor || 'transparent');
      setGradientDirection(currentText.gradientDirection || 'horizontal');
      setBackgroundGradientStartColor(currentText.backgroundGradientStartColor || '#000000');
      setBackgroundGradientEndColor(currentText.backgroundGradientEndColor || '#000000');
    }
  }, [currentElementId, texts, currentPlayTime, currentElement, texts.find((t) => t.id === currentElementId)?.fontSize]);

  // Update Redux when properties change
  useEffect(() => {
    if (currentElementId && currentElement === 'text') {
      dispatch(
        editText({
          id: currentElementId,
          startTime,
          endTime,
          text,
          font,
          fontSize,
          fontColor,
          backgroundType,
          backgroundColor: backgroundType === 'solid' ? backgroundColor : null,
          backgroundGradientStartColor: backgroundType === 'gradient' ? backgroundGradientStartColor : null,
          backgroundGradientEndColor: backgroundType === 'gradient' ? backgroundGradientEndColor : null,
          gradientDirection: backgroundType === 'gradient' ? gradientDirection : null,
          justify,
          rotation,
        })
      );
    }
  }, [
    startTime,
    endTime,
    text,
    font,
    fontSize,
    fontColor,
    backgroundType,
    backgroundColor,
    backgroundGradientStartColor,
    backgroundGradientEndColor,
    gradientDirection,
    justify,
    rotation,
    currentElement,
    currentElementId,
    dispatch,
  ]);

  // Handle background type change
  useEffect(() => {
    if (currentElementId && currentElement === 'text') {
      dispatch(changeBGType({ id: currentElementId, type: backgroundType }));
    }
  }, [backgroundType, dispatch]);

const getBackgroundStyle = () => {
  if (backgroundType === 'solid') {
    return { backgroundColor: backgroundColor || 'transparent' };
  }

  let direction = 'to right';
  if (gradientDirection === 'vertical') direction = 'to bottom';
  else if (gradientDirection === 'radial') return {
    backgroundImage: `radial-gradient(${backgroundGradientStartColor}, ${backgroundGradientEndColor})`
  };
  else if (gradientDirection === 'diagonal') direction = '45deg';

  return {
    backgroundImage: `linear-gradient(${direction}, ${backgroundGradientStartColor}, ${backgroundGradientEndColor})`,
  };
};

  function handleAddNewText() {
    setStartTime(currentPlayTime);
    setEndTime(currentPlayTime + 5);
    dispatch(setAddingElements(true));
    dispatch(setCurrentElementId({ id: null, type: null }));
    const textData: TextElementState = {
      id: Date.now().toString(),
      x: 0,
      y: 0,
      text,
      font,
      fontSize,
      fontColor,
      backgroundType,
      backgroundColor: backgroundType === 'solid' ? backgroundColor : null,
      backgroundGradientStartColor: backgroundType === 'gradient' ? backgroundGradientStartColor : null,
      backgroundGradientEndColor: backgroundType === 'gradient' ? backgroundGradientEndColor : null,
      gradientDirection: backgroundType === 'gradient' ? gradientDirection : null,
      justify,
      rotation,
      startTime,
      endTime,
        backgroundHeight: 0,
        backgroundWidth: 0
    };
    dispatch(addText(textData));
    dispatch(setCurrentElement('text'));
  }

  const textSizes = Array.from({ length: 200 - 8 + 1 }, (_, index) => 8 + index);

  return (
    <div className="w-full pb-4 pt-2 px-2 flex flex-col gap-3 relative text-[#a3a3a5]">
      {/* Header */}
      <div className="border-b border-[#303032] flex items-center pb-2 justify-between">
        <span className="text-[#ffffff] text-[14px]">Text</span>
        <button onClick={handleAddNewText} className="text-[#d9d9d9] cursor-pointer text-[14px]">
          <FaPlus />
        </button>
      </div>

      {/* Add New Text Button (when no texts exist) */}
      <div className="w-full flex" style={texts.length === 0 ? {} : { display: 'none' }}>
        <button
          className="cursor-pointer bg-[#422ad5] rounded-lg text-white mx-auto px-3 py-2 mt-4 flex items-center gap-2"
          onClick={handleAddNewText}
        >
          <FaPlus /> Add New Text
        </button>
      </div>

      {/* Text Options (when texts exist) */}
      {currentElement === 'text' && <div className="border-b border-[#303032] flex flex-col gap-3" style={texts.length === 0 ? { display: 'none' } : {}}>
        <div className="px-3 flex flex-col gap-3" >
          {/* Text Input */}
          <input
            className="input bg-transparent border-[#303032] w-full shadow-none text-[#ffffff] px-2 py-1 rounded-md"
            style={{...getBackgroundStyle(), fontFamily: font, textAlign: 'center', color: fontColor }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text"
          />

          {/* Font and Size */}
          <div className="flex w-full gap-1">
            <select
              className="select flex-1 bg-transparent shadow-none border-[1px] border-[#303032] cursor-pointer outline-none focus:outline-none text-[#a3a3a5] rounded-md px-2 py-1"
              value={font}
              onChange={(e) => setFont(e.target.value)}
            >
              <option value="Open Sans">Open Sans</option>
              <option value="Alegreya">Alegreya</option>
              <option value="Arial">Arial</option>
              <option value="Roboto">Roboto</option>
              <option value="Anek Latin">Anek Latin</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Poppins">Poppins</option>
              <option value="Oswald">Oswald</option>
              <option value="Raleway">Raleway</option>
            </select>
            <select
              className="select w-18 bg-transparent shadow-none border-[1px] border-[#303032] cursor-pointer outline-none focus:outline-none text-[#a3a3a5] rounded-md px-2 py-1"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
            >
              {textSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            {/* Font Color */}
            <div
              className="w-10 h-10 flex items-center justify-center border border-[#303032] cursor-pointer relative rounded-md"
              style={{ backgroundColor: fontColor }}
              onClick={() => fontColorInputRef.current?.click()}
            >
              <RiFontColor size={18} className="z-10 text-[#a3a3a5]" />
              <input
                type="color"
                ref={fontColorInputRef}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
              />
            </div>
          </div>

          {/* Background Type Toggle */}
          <div className="flex gap-2">
            <button
              className={`flex-1 py-1 rounded-md text-sm ${backgroundType === 'solid' ? 'bg-[#422ad5] text-white' : 'bg-[#212025] text-[#a3a3a5]'}`}
              onClick={() => setBackgroundType('solid')}
            >
              Solid
            </button>
            <button
              className={`flex-1 py-1 rounded-md text-sm ${backgroundType === 'gradient' ? 'bg-[#422ad5] text-white' : 'bg-[#212025] text-[#a3a3a5]'}`}
              onClick={() => setBackgroundType('gradient')}
            >
              Gradient
            </button>
          </div>

          {/* Background Color (Solid) */}
          {backgroundType === 'solid' && (
            <div className="flex items-center gap-2">
              <span className="text-sm">Background Color</span>
              <div
                className="w-10 h-10 flex items-center justify-center border border-[#303032] cursor-pointer relative rounded-md"
                style={{ backgroundColor }}
                onClick={() => backgroundColorInputRef.current?.click()}
              >
                <TbBackground size={18} className="z-10 text-[#a3a3a5]" />
                <input
                  type="color"
                  ref={backgroundColorInputRef}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Gradient Options */}
          {backgroundType === 'gradient' && (
            <div className="flex flex-col gap-2">
              {/* Gradient Direction */}
              <select
                className="select w-full bg-transparent shadow-none border-[1px] border-[#303032] cursor-pointer outline-none focus:outline-none text-[#a3a3a5] rounded-md px-2 py-1"
                value={gradientDirection}
                onChange={(e) => setGradientDirection(e.target.value)}
              >
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertical</option>
                <option value="radial">Radial</option>
                <option value="diagonal">Diagonal</option>
              </select>

              {/* Gradient Colors */}
              <div className="flex gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Start</span>
                  <div
                    className="w-10 h-10 flex items-center justify-center border border-[#303032] cursor-pointer relative rounded-md"
                    style={{ backgroundColor: backgroundGradientStartColor }}
                    onClick={() => gradientStartColorRef.current?.click()}
                  >
                    <TbBackground size={18} className="z-10 text-[#a3a3a5]" />
                    <input
                      type="color"
                      ref={gradientStartColorRef}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      value={backgroundGradientStartColor}
                      onChange={(e) => setBackgroundGradientStartColor(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">End</span>
                  <div
                    className="w-10 h-10 flex items-center justify-center border border-[#303032] cursor-pointer relative rounded-md"
                    style={{ backgroundColor: backgroundGradientEndColor }}
                    onClick={() => gradientEndColorRef.current?.click()}
                  >
                    <TbBackground size={18} className="z-10 text-[#a3a3a5]" />
                    <input
                      type="color"
                      ref={gradientEndColorRef}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      value={backgroundGradientEndColor}
                      onChange={(e) => setBackgroundGradientEndColor(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rotation */}
          <div className="flex items-center gap-3">
            <input
              className="range range-neutral cursor-pointer"
              type="range"
              min={-360}
              max={360}
              step={1}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
            />
            <input
              type="number"
              className="h-6 w-18 pl-2 border-1 rounded-md cursor-pointer bg-[#212025] text-[#ffffff]"
              placeholder="360"
              min={-360}
              max={360}
              step={1}
              onChange={(e) => setRotation(Number(e.target.value))}
              value={rotation}
            />
          </div>
        </div>

        {/* Text Instances */}
        {texts.map((text) => (
          <div
            className="w-full flex gap-2 p-3 justify-between cursor-pointer hover:bg-[#212025]"
            style={activeId === text.id ? { backgroundColor: '#212025' } : {}}
            key={text.id}
            onClick={() => handleClick(text)}
          >
            <div className="flex items-center gap-3">
              <label className="text-[#a3a3a5] text-sm text-nowrap">Start Time</label>
              <span className="w-1/2 outline-none border-0 bg-[#212025] text-[#ffffff] rounded-md px-2 py-1 text-center">
                {Number(text.startTime).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-[#a3a3a5] text-sm text-nowrap">End Time</label>
              <span className="w-1/2 outline-none border-0 bg-[#212025] text-[#ffffff] rounded-md px-2 py-1 text-center">
                {Number(text.endTime).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <label
                className="text-[#ffa6bf] cursor-pointer"
                onClick={() => dispatch(deleteText({ id: text.id }))}
              >
                <FaRegTrashAlt />
              </label>
            </div>
          </div>
        ))}
      </div>}
    </div>
  );
};

export default TextOptions;