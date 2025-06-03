import React from "react";
import { icons, IconData } from "@/constants/icons";

interface AppIconProps {
  name: keyof typeof icons;
  size?: number;
  color?: string;
}

type VectorIconProps = {
  name: string;
  size?: number;
  color?: string;
};

type SvgIconProps = {
  width?: number;
  height?: number;
  fill?: string;
};

const AppIcon: React.FC<AppIconProps> = ({ name, size, color }) => {
  const iconData = icons[name] as IconData | undefined;
  if (!iconData) return null;

  const IconComponent = iconData.component as React.ComponentType<VectorIconProps | SvgIconProps>;
  const iconName = iconData.name;

  if (!iconName) {
    return <IconComponent width={size} height={size} fill={color} />;
  }
  return <IconComponent name={iconName} size={size} color={color} />;
};

export default AppIcon;
