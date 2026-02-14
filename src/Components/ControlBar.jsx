import { createSignal, Match, Show, splitProps, Switch } from "solid-js";
import { HoverBlock } from "./Common/HoverBlock";
import { BilibiliDanmakuGetterType, DanmakuOperateType, DanmakuSource, PRIMARY_BG_COLOR } from "../constant";
import { Button, PureButton, SimpleTooltip } from "./Common/Button";
import { DanmakuToggleIcon, ResizeIcon, ToggleFullscreenIcon } from "./Common/Svg";
import { TopDrawer } from "./Common/Drawer";
import { DropdownMenu } from "./Common/Select";
import { RadioList, TextInput, Upload } from "./Common/Input";
import { Textarea } from "./Common/Textarea";
import { copyToClipboard } from "../utils";

const logInfo = (...rest) => console.info('[Info:ControlBar]', ...rest);
const logWarn = (...rest) => console.warn('[Warn:ControlBar]', ...rest);

export const ControlBar = (props) => {
  const [local, other] = splitProps(props, [
    'children',
    'className',
    'danmakuOperationEnable',
    'onClickDanmakuOperate',
    'onClickToggleFullscreen',
    'onClickApplyDanmakuSrc',
  ]);
  const danmakuOperationEnable = () => local.danmakuOperationEnable || false;
  const [forceVisible, setForceVisible] = createSignal(true);
  const [danmakuIsInvisible, setDanmakuIsInvisible] = createSignal(false);
  const [isFullscreen, setIsFullscreen] = createSignal(false);
  const [isDanmakuSrcConf, setIsDanmakuSrcConf] = createSignal(false);
  const [selectedDanmakuSrc, setSelectedDanmakuSrc] = createSignal(DanmakuSource.Bilibili);
  const [vid, setVid] = createSignal('');
  const [bilibiliDanmakuGetterType, setBilibiliDanmakuGetterType] = createSignal(BilibiliDanmakuGetterType.UploadFile);
  const [xmlText, setXmlText] = createSignal({ type: null, value: '' });
  const [youkuXmlText, setYoukuXmlText] = createSignal('');
  const [oid, setOid] = createSignal('');
  const [linkGetXmlText, setLinkGetXmlText] =createSignal('');

  const handleDanmakuXmlFileSelect = (type, files) => {
    const file = files[0];
    
    if (!file) {
      this.options.onError(new Error('未选择文件'));
      return;
    }

    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = (event) => {
      setXmlText({ type, value: event.target.result });
    };
  };

  const onClickApplyBtn = () => {
    logInfo('onClickApplyBtn invoked.');
    if (!local.onClickApplyDanmakuSrc) {
      logWarn('props.onClickApplyDanmakuSrc is empty!');
      return;
    }

    if ([DanmakuSource.Bilibili, DanmakuSource.Youku].includes(selectedDanmakuSrc())) {
      if (!xmlText().value) {
        logWarn(`[${selectedDanmakuSrc()}]: xml text empty!`)
        return;
      }

      local.onClickApplyDanmakuSrc(selectedDanmakuSrc(), {
        xmlText: xmlText().value,
      });
    } else {
      if (!vid()) {
        logWarn(`[${selectedDanmakuSrc()}]: vid empty!`);
        return;
      }

      local.onClickApplyDanmakuSrc(selectedDanmakuSrc(), {
        vid: vid(),
      });
    }

    setIsDanmakuSrcConf(false);
    setForceVisible(false);
  };

  return (
    <div id="danmaku-fusion_controlbar"
      className={`
        w-full text-right absolute top-0 left-0 z-1001 pointer-events-auto
        ${local.className || ''}
      `}
    >
      <HoverBlock
        className="pb-1"
        forceVisible={forceVisible()}
        // onMouseEnter={() => setForceVisible(false)}
        onMouseEnter={() => setForceVisible(false)}
      >
        <div className={`flex justify-end py-2 px-1`}>
          <div className={`${PRIMARY_BG_COLOR} shadow-gray-700 -z-1 opacity-80 absolute top-0 bottom-1 left-0 w-full`} />

          <Button onClick={() => {
            setIsDanmakuSrcConf(true);
            setForceVisible(true);
          }}>弹幕源配置</Button>

          <Show when={danmakuOperationEnable()}>
            <span className="text-white text-xs inline-block mx-1 align-bottom">
              字号: 
              <DropdownMenu
                selected={'20'}
                options={[
                  { text: '16px', value: '16' },
                  { text: '18px', value: '18' },
                  { text: '20px', value: '20' },
                  { text: '22px', value: '22' },
                  { text: '24px', value: '24' },
                ]}
                onChange={(fontSize) => {
                  local.onClickDanmakuOperate(DanmakuOperateType.FontSize, { fontSize });
                }}
              />
            </span>

            <span className="text-white text-xs inline-block mx-1 align-bottom">
              不透明: 
              <DropdownMenu
                selected={'1'}
                options={[
                  { text: '100%', value: '1' },
                  { text: '80%', value: '0.8' },
                  { text: '60%', value: '0.6' },
                ]}
                onChange={(opacity) => {
                  local.onClickDanmakuOperate(DanmakuOperateType.Opacity, { opacity });
                }}
              />
            </span>

            <SimpleTooltip
              placement="bottom-right"
              content="重置弹幕池尺寸"
              contentClass="w-24"
            >
              <PureButton
                className="p-1 rounded-sm mx-1"
                onClick={() => local.onClickDanmakuOperate(DanmakuOperateType.Resize)}
              >
                <ResizeIcon class="size-6" />
              </PureButton>
            </SimpleTooltip>

            <SimpleTooltip
              placement="bottom-right"
              content="弹幕显示/隐藏"
              contentClass="w-24"
            >
              <PureButton
                className="p-1 rounded-sm mx-1"
                onClick={() => {
                  local.onClickDanmakuOperate(
                    danmakuIsInvisible() ? DanmakuOperateType.Show : DanmakuOperateType.Hide
                  );
                  setDanmakuIsInvisible(!danmakuIsInvisible());
                }}
              >
                <DanmakuToggleIcon class="size-6" active={!danmakuIsInvisible()} />
              </PureButton>
            </SimpleTooltip>
          </Show>

          <PureButton className="p-1 rounded-sm mx-1" onClick={() => {
            local.onClickToggleFullscreen();
            setIsFullscreen(!isFullscreen());
          }}>
            <ToggleFullscreenIcon fullscreen={!isFullscreen()} class="size-6" />
          </PureButton>

          {local.children}
        </div>
      </HoverBlock>

      <TopDrawer
        open={isDanmakuSrcConf()}
        onBackdropClick={() => setIsDanmakuSrcConf(false)}
      >
        <div className="bg-white px-3 py-5 text-left">
          <DropdownMenu
            selected={selectedDanmakuSrc()}
            options={[
              { text: '腾讯视频', value: DanmakuSource.Vqq },
              { text: 'Bilibili', value: DanmakuSource.Bilibili },
              { text: '优酷', value: DanmakuSource.Youku },
            ]}
            onChange={(danmakuSource) =>  setSelectedDanmakuSrc(danmakuSource)}
          />

          <Switch>
            <Match when={selectedDanmakuSrc() === DanmakuSource.Vqq}>
              <div className="mt-6 ml-1">
                <TextInput
                  label={'vid: '}
                  value={vid()}
                  onChange={(vid) => setVid(vid)}
                />
              </div>
            </Match>
            <Match when={selectedDanmakuSrc() === DanmakuSource.Bilibili}>
              <div className="mt-6 pl-1">
                <RadioList
                  className="mb-4 relative right-2"
                  name="bilibi-danmaku_getter-type"
                  list={[
                    { label: '上传文件', value: BilibiliDanmakuGetterType.UploadFile },
                    { label: 'XML 文本', value: BilibiliDanmakuGetterType.XmlText },
                    { label: '生成链接', value: BilibiliDanmakuGetterType.GenerateLink },
                    // { label: '本地服务', value: BilibiliDanmakuGetterType.LocalServe },
                  ]}
                  defValue={bilibiliDanmakuGetterType()}
                  onChange={(value) => setBilibiliDanmakuGetterType(value)}
                />

                <Switch>
                  <Match when={bilibiliDanmakuGetterType() === BilibiliDanmakuGetterType.UploadFile}>
                    {/* <label for="bilibili-danmaku-xml">选择要上传的文件</label> */}
                    <Upload onChange={(files) => handleDanmakuXmlFileSelect(DanmakuSource.Bilibili, files)} />
                  </Match>
                  {/* <Match when={bilibiliDanmakuGetterType() === BilibiliDanmakuGetterType.LocalServe}>
                    服务地址: <input type="text" />
                  </Match> */}
                  <Match when={bilibiliDanmakuGetterType() === BilibiliDanmakuGetterType.XmlText}>
                    <Textarea
                      className="w-90 h-30"
                      placeholder="粘贴 XML 文本至此"
                      value={xmlText().value}
                      onChange={(value) => setXmlText({ type: DanmakuSource.Bilibili, value })}
                    />
                  </Match>
                  <Match when={bilibiliDanmakuGetterType() === BilibiliDanmakuGetterType.GenerateLink}>
                    <TextInput
                      placeholder="输入 oid"
                      value={oid()}
                      onChange={setOid}
                    />
                    <Button onClick={async () => {
                      if (!oid()) {
                        return;
                      }
                      const link = `https://api.bilibili.com/x/v1/dm/list.so?oid=${oid()}`;
                      setLinkGetXmlText(link);
                      copyToClipboard(link);
                    }}>生成链接</Button>

                    <Show when={linkGetXmlText()}>
                      <div className="mt-4">
                        <TextInput className="w-110" readonly={true} value={linkGetXmlText()} />
                        <Button onClick={() => {
                          window.open();
                        }}>复制去新页面粘贴打开</Button>
                      </div>
                    </Show>
                  </Match>
                </Switch>
              </div>
            </Match>
            <Match when={selectedDanmakuSrc() === DanmakuSource.Youku}>
              <div className="mt-6 pl-1">
                <Upload onChange={(files) => handleDanmakuXmlFileSelect(DanmakuSource.Youku, files)} />

                <div className="mt-2">
                  <a target="_blank"
                  className="text-blue-500 underline text-xs"
                  href="https://www.kedou.life/caption/scrolling/youku">去第三方下载弹幕文件</a>
                </div>
              </div>
            </Match>
          </Switch>

          <Show when={selectedDanmakuSrc() === DanmakuSource.Vqq || bilibiliDanmakuGetterType() !== BilibiliDanmakuGetterType.GenerateLink}>
            <Button className="mt-8" onClick={onClickApplyBtn}>应用</Button>
          </Show>
        </div>
      </TopDrawer>
    </div>
  );
};
