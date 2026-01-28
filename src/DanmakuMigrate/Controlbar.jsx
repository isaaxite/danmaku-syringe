import { createSignal } from "solid-js";
import { Switch, Show, Index, Match } from "solid-js/web";
import { xmlDanmakuToJson } from "../utils";
import { store, setStore, DanmakuSource, BilibiliDanmakuGetterType } from "./store";
import { DanmakuOperateType } from "../constant";
import { InlineButton } from "../Component/Button";
import { DropdownMenu } from "../Component/Select";
import { TextInput } from "../Component/Input";

const CollapseType = {
  none: 'none',
  DanmakuConf: 'danmakuConf',
};

const SINGLE_DANMAKU_STYLE = {
  fontSize: '24px',
  color: '#ffffff',
  lineHeight: '36px',
  textShadow: '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000'
};

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
  const [getCollapseType, setCollapseType] = createSignal(CollapseType.none);

  const handleBilibiliDanmakuXmlSelect = (event) => {
    const file = event.target.files[0];
    
    if (!file) {
      this.options.onError(new Error('未选择文件'));
      return;
    }

    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = (event) => {
      const jsonData = xmlDanmakuToJson(event.target.result);
      setStore('danmakuData', jsonData);
    };
  };

  return (
    <div id="danmaku-migrate_controlbar" className="text-right alsolute top-0 left-0 z-1001" style="pointer-events: auto;">
      <div className="bg-white inline-flex justify-end pb-2 px-1 rounded">
        <InlineButton onClick={() => setCollapseType(CollapseType.DanmakuConf)}>弹幕源配置</InlineButton>

        <InlineButton onClick={() => props.onConsumeDanmaku()}>消费弹幕</InlineButton>

        <InlineButton onClick={() => props.onDanmakuOperateBtn(DanmakuOperateType.Resize)}>重置弹幕池尺寸</InlineButton>

        <InlineButton onClick={() => props.onFullscreenBtn()}>全屏</InlineButton>

        {props.children}
      </div>
      <Show when={getCollapseType() === CollapseType.DanmakuConf}>
        <div className="bg-slate-300 px-3 py-5 text-left">
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
                  { label: '上传文件', value: BilibiliDanmakuGetterType.UploadFile },
                  { label: '本地服务', value: BilibiliDanmakuGetterType.LocalServe },
                ]}
                defValue={BilibiliDanmakuGetterType.UploadFile}
                onChange={(value) => setStore('bilibiliDanmakuGetterType', value)}
              />

              <Switch>
                <Match when={store.bilibiliDanmakuGetterType === BilibiliDanmakuGetterType.UploadFile}>
                  <label for="bilibili-danmaku-xml">选择要上传的文件</label>
                  <input
                    type="file"
                    id="bilibili-danmaku-xml"
                    accept=".xml"
                    multiple={false}
                    onChange={handleBilibiliDanmakuXmlSelect}
                  />
                </Match>
                <Match when={store.bilibiliDanmakuGetterType === BilibiliDanmakuGetterType.LocalServe}>
                  服务地址: <input type="text" />
                </Match>
              </Switch>
              <div></div>
            </Match>
          </Switch>

          <InlineButton onClick={() => {
            setCollapseType(CollapseType.none);
            props.onConfirm && props.onConfirm();
          }}>确定</InlineButton>
        </div>
      </Show>
    </div>
  );
};

export default Controlbar;
