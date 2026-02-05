import { createSignal, Match, Show, splitProps, Switch } from "solid-js";
import { HoverBlock } from "./Component/HoverBlock";
import { BilibiliDanmakuGetterType, DanmakuOperateType, DanmakuSource, PRIMARY_BG_COLOR } from "./constant";
import { Button, PureButton } from "./Component/Button";
import { DanmakuToggleIcon, ResizeIcon, ToggleFullscreenIcon } from "./Component/Svg";
import { TopDrawer } from "./Component/Drawer";
import { DropdownMenu } from "./Component/Select";
import { RadioList, TextInput, Upload } from "./Component/Input";
import { Textarea } from "./Component/Textarea";

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
  const [bilibiliDanmakuGetterType, setBilibiliDanmakuGetterType] = createSignal(BilibiliDanmakuGetterType.XmlText);
  const [xmlText, setXmlText] = createSignal('');

  const handleBilibiliDanmakuXmlSelect = (files) => {
    const file = files[0];
    
    if (!file) {
      this.options.onError(new Error('未选择文件'));
      return;
    }

    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = (event) => setXmlText(event.target.result);
  };

  const onClickApplyBtn = () => {
    logInfo('onClickApplyBtn invoked.');
    if (!local.onClickApplyDanmakuSrc) {
      logWarn('props.onClickApplyDanmakuSrc is empty!');
      return;
    }

    if (selectedDanmakuSrc() === DanmakuSource.Bilibili) {
      if (!xmlText()) {
        logWarn(`[${selectedDanmakuSrc()}]: xml text empty!`)
        return;
      }

      local.onClickApplyDanmakuSrc(selectedDanmakuSrc(), {
        xmlText: xmlText(),
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
        className={`${PRIMARY_BG_COLOR} shadow shadow-gray-700`}
        forceVisible={forceVisible()}
        // onMouseEnter={() => setForceVisible(false)}
        onMouseEnter={() => setForceVisible(false)}
      >
        <div className=" inline-flex justify-end py-2 px-1">
          <Button onClick={() => {
            setIsDanmakuSrcConf(true);
            setForceVisible(true);
          }}>弹幕源配置</Button>

          <Show when={danmakuOperationEnable()}>
            <PureButton
              className="p-1 rounded-sm mx-1"
              onClick={() => local.onClickDanmakuOperate(DanmakuOperateType.Resize)}
            >
              <ResizeIcon class="size-6" />
            </PureButton>

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
          </Show>

          <PureButton className="p-1 rounded-sm mx-1" onClick={() => {
            local.onClickToggleFullscreen();
            setIsFullscreen(!isFullscreen());
          }}>
            <ToggleFullscreenIcon fullscreen={!isFullscreen()} class="size-6" />
          </PureButton>
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
                    { label: 'XML 文本', value: BilibiliDanmakuGetterType.XmlText },
                    { label: '上传文件', value: BilibiliDanmakuGetterType.UploadFile },
                    // { label: '本地服务', value: BilibiliDanmakuGetterType.LocalServe },
                  ]}
                  defValue={bilibiliDanmakuGetterType()}
                  onChange={(value) => setBilibiliDanmakuGetterType(value)}
                />

                <Switch>
                  <Match when={bilibiliDanmakuGetterType() === BilibiliDanmakuGetterType.UploadFile}>
                    {/* <label for="bilibili-danmaku-xml">选择要上传的文件</label> */}
                    <Upload onChange={handleBilibiliDanmakuXmlSelect} />
                  </Match>
                  {/* <Match when={bilibiliDanmakuGetterType() === BilibiliDanmakuGetterType.LocalServe}>
                    服务地址: <input type="text" />
                  </Match> */}
                  <Match when={bilibiliDanmakuGetterType() === BilibiliDanmakuGetterType.XmlText}>
                    <Textarea
                      placeholder="粘贴 XML 文本至此"
                      value={xmlText()}
                      onChange={setXmlText}
                    />
                  </Match>
                </Switch>
              </div>
            </Match>
          </Switch>

          <Button className="mt-8" onClick={onClickApplyBtn}>应用</Button>
        </div>
      </TopDrawer>
    </div>
  );
};
