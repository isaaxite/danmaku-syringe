import { createSignal, splitProps } from "solid-js";
import { A } from "@solidjs/router";

const VariantType = {
  Default: 'default',
  Underline: 'underline',
  Pill: 'pill'
};

export const Page = (props) => {
  return (
    <div className="mt-4 px-2"><hr />{props.children}</div>
  );
};

export const Block = (props) => {
  return (
    <div className="mt-4 px-2">{props.children}</div>
  );
};

export const InlineBlock = (props) => {
  return (
    <div className="inline-block mt-4 px-2">{props.children}</div>
  );
};

export const Tab = (props) => {
  const [local, other] = splitProps(props, ['children']);
  const [variant] = createSignal(VariantType.Pill);
  const [isActive] = createSignal(true);

  return (
    <A
      {...other}
      classList={{
        "active": isActive(),
        "disabled": props.disabled,
        "mx-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200": true,
        "bg-white text-gray-900 border border-gray-300": !isActive() && variant() === VariantType.Default,
        "bg-blue-600 text-white border-blue-600": isActive() && variant() === VariantType.Default,
        "hover:bg-gray-100": !isActive() && !props.disabled && variant() === VariantType.Default,
        "hover:bg-blue-700": isActive() && !props.disabled && variant() === VariantType.Default,
        
        // Outline variant
        "border-b-2": variant() === VariantType.Underline,
        "px-4 py-3 text-sm font-medium": variant() === VariantType.Underline,
        "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300": 
          !isActive() && variant() === VariantType.Underline,
        "border-blue-600 text-blue-600": isActive() && variant() === VariantType.Underline,
        
        // Pill variant
        "px-4 py-2 rounded-full": variant() === VariantType.Pill,
        "bg-gray-100 text-gray-700 hover:bg-gray-200": 
          !isActive() && variant() === VariantType.Pill,
        "bg-blue-600 text-white hover:bg-blue-700": 
          isActive() && variant() === VariantType.Pill,
        
        // Disabled styles
        "opacity-50 cursor-not-allowed": props.disabled,
      }}
    >{local.children}</A>
  )
};
