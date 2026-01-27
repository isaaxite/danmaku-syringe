import { onMount } from "solid-js";
import { isFunction } from "./utils";

const VideoContainer = (props) => {
  onMount(() => {
    isFunction(props.onMount) && props.onMount();
  });

  const getClassName = () => props.className || "";

  return (
    <div id="video-wrap" className={`size-full relative z-1000 overflow-hidden ${getClassName()}`}>
      <video ref={props.ref} muted="true" className="size-full" src={props.src} controls />
    </div>
  );
};

export default VideoContainer;
