import { splitProps, createSignal } from "solid-js";
import { PRIMARY_CLASSNAMES } from "../constant";

export const InlineButton = (props) => {
  const [local, other] = splitProps(props, ['children']);
  const btnDefClassList = "text-white px-2 py-1 rounded-sm mx-1 text-xs";
  const btnActClassList = "bg-blue-500 hover:bg-blue-700 cursor-pointer";

  return (
    <button {...other} className={`${btnDefClassList} mt-2 ${btnActClassList}`}>{local.children}</button>
  );
}

const ButtonFactory = (className = '') => (props) => {
  const DEAULT_CLASSlIST = `${PRIMARY_CLASSNAMES} inline-block align-bottom cursor-pointer`;
  const HOVER_CLASSlIST = 'hover:bg-amber-800';
  const [local, other] = splitProps(props, [
    'children',
    'className',
  ]);
  return (
    <button
      {...other}
      className={`
        ${className}
        ${DEAULT_CLASSlIST}
        ${HOVER_CLASSlIST}
        ${local.className || ''}
      `}
    >{local.children}</button>
  );
};

export const Button = ButtonFactory('px-2 py-1 rounded-sm mx-1');
export const IconRadiusButton = ButtonFactory('p-1 rounded-full');
export const PureButton = ButtonFactory();

const PLACEMENT_CLASSNAME = {
  'bottom': {
    baseline: 'bottom',
    tooltip: 'top-1 left-1/2 -translate-x-1/2',
    arrow: 'top-0 left-1/2 -translate-x-1/2 -mb-1'
  },
  'bottom-right': {
    baseline: 'bottom',
    tooltip: 'top-1 right-0',
    arrow: 'top-0 right-1/4 -translate-x-1/4 -mb-1'
  }
};

export const Baseline = (props) => {
  const POSITION = {
    top: 'top-0 left-0 h-0 w-full',
    right: 'right-0 top-0 h-full w-0',
    bottom: 'bottom-0 left-0 h-0 w-full',
    left: 'left-0 top-0 h-full w-0',
  };

  return (
    <div className={`overflow-visible absolute ${POSITION[props.placement]} ${props.className || ''}`}>
      {props.children}
    </div>
  );
};

export function SimpleTooltip(props) {
  const [show, setShow] = createSignal(false);
  const placementClassName = PLACEMENT_CLASSNAME[props.placement];
  
  return (
    <div class={`relative inline-block group ${props.className || ''}`}>
      {/* Trigger */}
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        class="inline-block"
      >
        {props.children}
      </div>
      
      {/* Tooltip */}
      <Baseline className={`
        transition-all duration-200
        opacity-0 invisible group-hover:opacity-100 group-hover:visible
        ${show() ? 'opacity-100 visible' : ''}  
      `} placement={placementClassName.baseline}>
        <div
          class={`
            absolute z-51 px-3 py-2 text-sm bg-slate-50
            rounded-md shadow-lg
            ${placementClassName.tooltip}
          `}
        >
          {props.content}
        </div>
        {/* Arrow */}
        <div
          class={`
            absolute z-50 w-2 h-2 rotate-45 bg-slate-50 shadow-inner
            ${placementClassName.arrow}
          `}
        />
      </Baseline>
    </div>
  );
}
