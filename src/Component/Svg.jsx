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

export const SyringeIcon = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" {...props} width="32" height="32" viewBox="0 0 32 32"><path style="opacity:1" fill="#010303" d="M23.875-.125h1.25a129 129 0 0 0 6.75 6.75v1.25q-.672.736-1.625 1-1.562-.709-2.875-1.625a53 53 0 0 0-3 3.125 30 30 0 0 1 3 3.5q-.792 2.246-3 1.625l-8.5 8.5a1.23 1.23 0 0 1-.75.125 2.1 2.1 0 0 1 .125-1l2.625-2.625a21 21 0 0 0-2-1.875 124 124 0 0 0-4.625-4.75l-.625.625 2.625 2.625q.181.355.125.75a2.1 2.1 0 0 1-1-.125l-2.25-2.25q-1.359.536-2.25 1.875a16 16 0 0 0 1.625 1.75q.181.355.125.75a1.23 1.23 0 0 1-.75-.125 16 16 0 0 0-1.75-1.625q-1.125.875-2 2a57 57 0 0 0 4.5 4.5 11.4 11.4 0 0 0 2 2q.706-.838 1.75-1 .301.346.125.75-2.089 2.513-4-.25-1.512 2.261-3.25.25a167 167 0 0 0-5.375 5.5h-1v-1a167 167 0 0 0 5.5-5.375q-2.011-1.738.25-3.25-1.66-1.007-1.375-2.875l12-12q-.621-2.208 1.625-3a17.7 17.7 0 0 1 3.25 2.875q1.989-1.169 3.5-3.125a11.7 11.7 0 0 0-1.375-1.5q-.906-1.659.625-2.75"/><path style="opacity:1" fill="#535358" d="M24.125 1.125q3.452 2.511 6.375 5.75.347.988-.625.875L24 1.875q-.176-.404.125-.75"/><path style="opacity:1" fill="#979797" d="M25.375 4.875q.963.336 1.5 1.25-1.625 1.875-3.5 3.5-.75-.5-1.25-1.25z"/><path style="opacity:1" fill="#3b637b" d="M20.625 10.875h-.25q.142-.824-.5-1.25-.5-.75-1.25-1.25a1.23 1.23 0 0 0-.125-.75q-.71-.583-1.125-1.375.099-.73.75-.5L26 13.625q.113.972-.875.625a99 99 0 0 0-4.25-4.125q-.332.309-.25.75"/><path style="opacity:1" fill="#d6e3f0" d="M18.625 8.375q.75.5 1.25 1.25-.529.905-1.5 1.25a11.4 11.4 0 0 1-2-2q.375-.625 1-1 .506.544 1.25.5"/><path style="opacity:1" fill="#d4e0ec" d="M17.625 11.625q-.834 1.401-2.125 2.5-.104-.344-.375-.5a16 16 0 0 1-1.5-1.875q.818-1.448 2.25-2a18 18 0 0 1 1.75 1.875"/><path style="opacity:1" fill="#959595" d="M20.375 10.875h.25l1 1.25-5.25 5.5q-.75-.5-1.25-1.25a45.5 45.5 0 0 0 5.125-4.75q.181-.355.125-.75"/><path style="opacity:1" fill="#abacac" d="M19.875 9.625q.642.426.5 1.25a1.23 1.23 0 0 1-.125.75 45.5 45.5 0 0 1-5.125 4.75q-.625-.375-1-1 1.465-.306.5-1.25.5 0 .5-.5.271.157.375.5 1.291-1.099 2.125-2.5.524.603 1.25.625.171-.155.25-.375a123 123 0 0 1-.75-1q.971-.345 1.5-1.25"/><path style="opacity:1" fill="#cad6e1" d="M14.625 14.125q.965.944-.5 1.25-1.495-.919-1.875-2.5l.5-.5a18 18 0 0 0 1.875 1.75"/><path style="opacity:1" fill="#c5d6e2" d="M21.625 12.125q1.452 1.008 2.125 2.5L18.875 19.5q-1.581-.38-2.5-1.875z"/><path style="opacity:1" fill="#0bbbbb" d="M15.875 18.625a53 53 0 0 1-6.25 6 57 57 0 0 1-4.5-4.5q.875-1.125 2-2a16 16 0 0 1 1.75 1.625q.355.181.75.125a1.23 1.23 0 0 0-.125-.75 16 16 0 0 1-1.625-1.75q.891-1.339 2.25-1.875l2.25 2.25a2.1 2.1 0 0 0 1 .125 1.23 1.23 0 0 0-.125-.75L10.625 14.5l.625-.625a124 124 0 0 1 4.625 4.75"/><path style="opacity:1" fill="#0daab6" d="M15.875 18.625a21 21 0 0 1 2 1.875l-2.625 2.625a2.1 2.1 0 0 0-.125 1l-1.75 1.5q-1.044.163-1.75 1a11.4 11.4 0 0 1-2-2 53 53 0 0 0 6.25-6"/><path style="opacity:1" fill="#315d75" d="M6.375 23.125q1.343.715 2.25 2a5 5 0 0 1-.875 1L5.625 24a3.7 3.7 0 0 0 .75-.875"/></svg>
  );
};
