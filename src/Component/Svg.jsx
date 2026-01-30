import { For, createSignal, createEffect, onMount } from 'solid-js';

export const EntertFullscreenIcon = (props) => (
  <svg 
    class={`w-4 h-4 ${props.className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 1v4m0 0h-4m4 0l-5-5" />
  </svg>
);

export const ExittFullscreenIcon = (props) => (
  <svg 
    class={`w-4 h-4 ${props.className}`}
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
          d="M9 9V4M9 9H4M9 9L4 4m15 5V4m0 5h5m-5 0l5-5M9 15v5m0-5H4m5 0l-5 5m15-5v5m0-5h5m-5 0l5 5" />
  </svg>
);

export const CollapseIcon = (props) => {
  const isExpanded = () => props.isExpanded;

  return (
    <svg 
      class={`w-4 h-4 transform transition-transform duration-200 ${isExpanded() ? 'rotate-180' : ''}`}
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 13l-7 7-7-7" />
    </svg>
  );
}

export const DanmakuToggleIcon = (props) => {
  const active = () => props.active;

  return (
    <svg viewBox="0 0 24 24" class="w-6 h-6">
      <g>
        <rect x="3" y="3" width="18" height="18" rx="2" 
          class={active() ? 'fill-blue-500' : 'fill-gray-300'} />
        <g class={active() ? 'text-white' : 'text-gray-500'}>
          <line x1="7" y1="9" x2="17" y2="9" stroke="currentColor" />
          <line x1="7" y1="12" x2="15" y2="12" stroke="currentColor" />
          <line x1="7" y1="15" x2="13" y2="15" stroke="currentColor" />
        </g>
        {!active() && (
          <line x1="6" y1="18" x2="18" y2="6" 
            class="stroke-white stroke-[3]" />
        )}
      </g>
    </svg>
  );
};
