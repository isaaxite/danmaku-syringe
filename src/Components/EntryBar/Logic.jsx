import { findHighestMatchingAncestor } from "../../utils";
import { substituteDanmakuFusionRender, therealDanmakuFusionRender } from "../DanmakuFusion/render";
import { ContainerType } from "../../constant";

const getVideoRef = () => document.querySelector('video');

export const EntryBarLogic = () => {

  const getTherealRootRef = (isInsertPointAuto, insertPath, videoRef) => {
    let ref = null;
    if (isInsertPointAuto) {
      console.info('Auto find the thereal root.');
      ref = findHighestMatchingAncestor(videoRef);
      if (!ref) {
        console.warn('Auto find the thereal root: Fail!');
      }
      return ref;
    }

    ref = document.querySelector(insertPath);
    if (!ref) {
      console.warn('Using insertPath to find the thereal root: Fail!');
    }
    return ref;
  }

  const appendDanmakuContainerToThereal = ({
    isInsertPointAuto,
    insertPath,
  }) => {
    const videoRef = getVideoRef();
    const rootRef = getTherealRootRef(isInsertPointAuto, insertPath, videoRef);
    if (!rootRef) {
      return { isFail: true };
    }

    therealDanmakuFusionRender(rootRef, videoRef);

    return { isFail: false };
  };

  const appendSubstituteRoot = () => {
    const ret = { isFail: true };
    const videoRef = getVideoRef();
    const videoSrc = videoRef.getAttribute('src');
    if (!videoSrc) {
      console.info('Can not find any video src!');
      return ret;
    }

    videoRef.pause();
    substituteDanmakuFusionRender(videoSrc);

    ret.isFail = false;
    return ret;
  }

  const onClickApplyBtn = (containerType, rest) => {
    switch (containerType) {
      case ContainerType.Substitute:
        return appendSubstituteRoot();

      case ContainerType.Thereal:
        return appendDanmakuContainerToThereal(rest);

      default:
        console.warn(`Unexcept ContainerType Type, current is ${containerType || '<empty string>'}`);
    }
  }

  return { onClickApplyBtn };
};
