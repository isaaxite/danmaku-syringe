// TabPage.jsx
import { createSignal, createContext, useContext, onMount } from "solid-js";
import { generateRandomString } from "../utils";

const TabContext = createContext();

export const TabPage = (props) => {
  const [activeIndex, setActiveIndex] = createSignal('');
  
  const contextValue = {
    sign: generateRandomString(),
    activeIndex,
    setActiveIndex
  };
  
  return (
    <TabContext.Provider value={contextValue}>
      <div class={props.class}>
        {props.children}
      </div>
    </TabContext.Provider>
  );
};

export const Tabs = (props) => {
  const context = useContext(TabContext);

  onMount(() => {
    if (props.defIndex) {
      context.setActiveIndex(props.defIndex);
    }
  });

  return (
    <div 
      role="tablist" 
      aria-orientation={props.orientation || "horizontal"}
      className={`flex flex-row ${props.className || ''}`}
    >
      {props.children}
    </div>
  );
};

export const Tab = (props) => {
  const context = useContext(TabContext);
  const index = props.index;

  const handleClick = () => {
    if (context && index !== undefined) {
      context.setActiveIndex(index);
      if (props.onClick) {
        props.onClick(index);
      }
    }
  };

  return (
    <div
      role="tab"
      id={`tab-${context.sign}-${index}`}
      onClick={handleClick}
      className={`inline-block ${props.className || ''}`}
    >
      {props.children}
    </div>
  );
};

export const TabPanels = (props) => {
  return (
    <div 
      role="tabpanels"
      className={props.className || ''}
    >
      {props.children}
    </div>
  );
};

export const TabPanel = (props) => {
  const context = useContext(TabContext);
  const index = props.index;
  const isActive = () => context?.activeIndex?.() === index;
  
  return (
    <div
      role="tabpanel"
      id={`panel-${index}`}
      className={props.className || ''}
      style={{ display: isActive() ? 'block' : 'none' }}
    >
      {props.children}
    </div>
  );
};
