const VideoContainer = (props) => {


  return (
    <>
      <div className="bg-neutral-950 absolute top-0 left-0 size-full"></div>
      <div id="video-wrap" className="size-full relative z-10">
        <video ref={props.ref} muted="true" className="size-full" src={props.src} controls />
      </div>
    </>
  );
};

export default VideoContainer;
