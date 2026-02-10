import { generateRandomString } from "./utils";

export const DanmakuOperateType = {
  Resize: 'resize',
  Hide: 'hide',
  Show: 'show',
  FontSize: 'fontSize',
  Opacity: 'opacity',
};

export const SINGLE_DANMAKU_STYLE = {
  // fontSize: '24px',
  color: '#ffffff',
  // lineHeight: '36px',
  textShadow: '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000'
};

export const ContainerType = {
  Substitute: 'substitute',
  Thereal: 'thereal',
};

export const CollapseType = {
  none: 'none',
  DanmakuConf: 'danmakuConf',
};

export const DanmakuSource = {
  Vqq: 'vqq',
  Bilibili: 'bilibili',
};

export const BilibiliDanmakuGetterType = {
  LocalServe: 'localserve',
  UploadFile: 'uploadfile',
  XmlText: 'xmltext',
  GenerateLink: 'generateLink',
};

export const PRIMARY_BG_COLOR = 'bg-gray-900';
export const PRIMARY_FONTSIZE = 'text-xs';
export const PRIMARY_CLASSNAMES = `bg-amber-700 hover:bg-amber-800 ${PRIMARY_FONTSIZE} text-white`;

export const MAX_POOL_NUM = 2;
export const VIDEO_TIME_SLOT_UNIT = 30;  // SECOND

export const DANMAKU_POOL_ELEMENT_ID = `danmaku-pool-${generateRandomString()}`;

export const FULLSCREEN_CHANGE_EVENTS = [
  'fullscreenchange',
  'webkitfullscreenchange',
  'mozfullscreenchange',
  'MSFullscreenChange',
];
