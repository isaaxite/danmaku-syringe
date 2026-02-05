import { createSignal, splitProps } from "solid-js";
import { Switch, Index, Match } from "solid-js/web";
import { xmlDanmakuToJson } from "../utils";
import { store, setStore, DanmakuSource, BilibiliDanmakuGetterType } from "./store";
import { CollapseType, DanmakuOperateType } from "../constant";
import { InlineButton } from "../Component/Button";
import { DropdownMenu } from "../Component/Select";
import { TextInput, Upload } from "../Component/Input";
import { Textarea } from "../Component/Textarea";
import { TopDrawer } from "../Component/Drawer";
import { ToggleFullscreenIcon } from "../Component/Svg";
import { HoverBlock } from "../Component/HoverBlock";

const RadioList = (props) => {
  const getListData = () => props.list;
  const [getSelected, setSelected] = createSignal(props.defValue);
  const onChangeHandler = (e) => {
    setSelected(e.target.value);
    props?.onChange(e.target.value);
  };

  return (
    <div>
      <Index each={getListData()}>
        {(item, index) => (
          <div className="inline-block mx-2">
            <input
              name={props.name}
              id={`${props.name}-${index}`}
              type="radio" value={item().value}
              checked={item().value === getSelected()}
              onChange={onChangeHandler}
              className="cursor-pointer"
            />
            <label for={`${props.name}-${index}`} className="cursor-pointer pl-1">{item().label}</label>
          </div>
        )}
      </Index>
    </div>
  );
};

const Controlbar = (props) => {
  const [local, other] = splitProps(props, [
    // 'visible',
    'children',
    'className',
    'danmakuOperationIsVisible',
    'onConfirm',
    'onFullscreenBtn',
    'onConsumeDanmaku',
    'onDanmakuOperateBtn',
  ]);
  const propsClassName = () => local.className;
  const danmakuOperationIsVisible = () => local.danmakuOperationIsVisible;
  const [getCollapseType, setCollapseType] = createSignal(CollapseType.none);
  const [getXmlText, setXmlText] = createSignal('');
  const [danmakuIsInvisible, setDanmakuIsInvisible] = createSignal(false);
  const [forceVisible, setForceVisible] = createSignal(true);

  const xml2jsonAndSetStore = () => {
    if (!getXmlText()) {
      return;
    }
    const jsonData = xmlDanmakuToJson(getXmlText());
    setStore('danmakuData', jsonData);
  };

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

  return (
    <HoverBlock forceVisible={forceVisible()} onMouseEnter={() => setForceVisible(false)}>
      <div id="danmaku-migrate_controlbar" className={`w-full bg-white text-right alsolute top-0 left-0 z-1001 ${propsClassName()}`} style="pointer-events: auto;">
        <div className=" inline-flex justify-end pb-2 px-1 rounded">
          <InlineButton onClick={() => {
            setForceVisible(true);
            setCollapseType(CollapseType.DanmakuConf);
          }}>弹幕源配置</InlineButton>

          <InlineButton onClick={() => local.onConsumeDanmaku()}>消费弹幕</InlineButton>

          <Show when={danmakuOperationIsVisible()}>
            <InlineButton onClick={() => local.onDanmakuOperateBtn(DanmakuOperateType.Resize)}>重置弹幕池尺寸</InlineButton>

            <Switch>
              <Match when={danmakuIsInvisible()}>
                <InlineButton onClick={() => {
                  setDanmakuIsInvisible(!danmakuIsInvisible());
                  local.onDanmakuOperateBtn(DanmakuOperateType.Show);
                }}>显示弹幕</InlineButton>
              </Match>
              <Match when={!danmakuIsInvisible()}>
                <InlineButton onClick={() => {
                  setDanmakuIsInvisible(!danmakuIsInvisible());
                  local.onDanmakuOperateBtn(DanmakuOperateType.Hide);
                }}>隐藏弹幕</InlineButton>
              </Match>
            </Switch>
          </Show>

          <InlineButton onClick={() => local.onFullscreenBtn()}>
            <ToggleFullscreenIcon fullscreen={true} />
          </InlineButton>

          {local.children}
        </div>
        <TopDrawer
          open={getCollapseType() === CollapseType.DanmakuConf}
          onBackdropClick={() => setCollapseType(CollapseType.none)}
        >
          <div className="bg-white px-3 py-5 text-left">
            <DropdownMenu
              selected={store.danmakuSource}
              options={[
                { text: '腾讯视频', value: DanmakuSource.Vqq },
                { text: 'Bilibili', value: DanmakuSource.Bilibili },
              ]}
              onChange={(value) =>  setStore("danmakuSource", value)}
            />

            <Switch>
              <Match when={store.danmakuSource === DanmakuSource.Vqq}>
                <div>
                  <TextInput
                    label={'Vid:'}
                    value={store.videoId}
                    onChange={(videoId) => setStore('videoId', videoId)}
                  />
                </div>
              </Match>
              <Match when={store.danmakuSource === DanmakuSource.Bilibili}>
                <RadioList
                  name="bilibi-danmaku_getter-type"
                  list={[
                    { label: 'XML 文本', value: BilibiliDanmakuGetterType.XmlText },
                    { label: '上传文件', value: BilibiliDanmakuGetterType.UploadFile },
                    { label: '本地服务', value: BilibiliDanmakuGetterType.LocalServe },
                  ]}
                  defValue={store.bilibiliDanmakuGetterType}
                  onChange={(value) => setStore('bilibiliDanmakuGetterType', value)}
                />

                <Switch>
                  <Match when={store.bilibiliDanmakuGetterType === BilibiliDanmakuGetterType.UploadFile}>
                    {/* <label for="bilibili-danmaku-xml">选择要上传的文件</label> */}
                    <Upload onChange={handleBilibiliDanmakuXmlSelect} />
                  </Match>
                  <Match when={store.bilibiliDanmakuGetterType === BilibiliDanmakuGetterType.LocalServe}>
                    服务地址: <input type="text" />
                  </Match>
                  <Match when={store.bilibiliDanmakuGetterType === BilibiliDanmakuGetterType.XmlText}>
                    <Textarea value={getXmlText()} onChange={setXmlText}/>
                  </Match>
                </Switch>
                <div></div>
              </Match>
            </Switch>

            <InlineButton onClick={() => {
              switch (store.danmakuSource) {
                case DanmakuSource.Bilibili:
                  if (store.bilibiliDanmakuGetterType === BilibiliDanmakuGetterType.UploadFile || store.bilibiliDanmakuGetterType === BilibiliDanmakuGetterType.XmlText) {
                    xml2jsonAndSetStore();
                  }
                  break;
                default:

              }

              setCollapseType(CollapseType.none);
              local.onConfirm && local.onConfirm();
            }}>确定</InlineButton>
          </div>
        </TopDrawer>
      </div>
    </HoverBlock>
  );
};

export default Controlbar;
