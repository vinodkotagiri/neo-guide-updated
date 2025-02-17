import React from "react";

export interface UploadDialougeProps {
  isOpen: boolean;
  setIsOpen:React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IconButtonProps{
  label:string;
  Icon:React.ElementType;
  onClick: () => void;
  isActive:boolean;
}