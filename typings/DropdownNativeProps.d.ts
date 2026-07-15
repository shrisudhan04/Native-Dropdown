/**
 * This file was generated from DropdownNative.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ActionValue, DynamicValue, EditableValue, NativeImage } from "mendix";
import { CSSProperties } from "react";

export interface DropdownNativeProps<Style> {
    name: string;
    style: Style[];
    value: EditableValue<string>;
    options: string;
    placeholder: string;
    leftImage?: DynamicValue<NativeImage>;
    arrowImage?: DynamicValue<NativeImage>;
    onChange?: ActionValue;
}

export interface DropdownNativePreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode: "design" | "xray" | "structure";
    translate: (text: string) => string;
    value: string;
    options: string;
    placeholder: string;
    leftImage: { type: "static"; imageUrl: string } | { type: "dynamic"; entity: string } | null;
    arrowImage: { type: "static"; imageUrl: string } | { type: "dynamic"; entity: string } | null;
    onChange: {} | null;
}
