import { onMount } from "solid-js";

const DanmakuMigrate = (props) => {
  const getVideoSrc = () => props.videoSrc;
  const getContainerRef = () => props.containerRef;

  onMount(() => {
    console.info(getVideoSrc())
    console.info(getContainerRef())
  })

  return (
    <>
      <div id="danmaku-migrate_controlbar">c</div>
      <div id="danmaku-migrate_danmaku-video">dv</div>
    </>
  );
};

export default DanmakuMigrate;
