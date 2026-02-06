import { createSignal } from "solid-js";
import { Block, Page } from "./Component";
import { Button } from "../../src/Component/Button";
import { createRefValue } from "../../src/utils";
// import { EntryBarView } from "../../src/EntryBar/View";
// import EntryBar from "../../src/EntryBar";
// import { createSignal, onMount } from "solid-js";
// import { DanmakuPool } from "../../src/DanmakuPool";

export default () => {
  const [count, setCount] = createSignal(0);
  const [refCount, setRefcount] = createRefValue(0);

  return (
    <Page>
      <Button onClick={() => setCount(count() + 1)} >自增 count</Button>
      <div>响应式数据 count: {count()}</div>

      <Button onClick={() => setRefcount(refCount() + 1)}>自增 refCount</Button>
      <div>引用式数据 refCount: {refCount()}</div>

      <Button onClick={() => console.info({
        count: count(),
        refCount: refCount(),
      })}>打印数据</Button>
      <Button onClick={() => {
        window.open()
      }}>test</Button>
      {/* <Block>
        <DanmakuPool
          rootRef={document.querySelector('#video-container')}
          videoRef={document.querySelector('#video-container video')}
        />
      </Block>

      <Block>
        <EntryBarView onClickApplyBtn={(containerType, rest) => {
          console.info('EntryBar onClickInjectBtn', { containerType, rest })
        }}/>
      </Block>

      <Block>
        <EntryBar />
      </Block> */}
    </Page>
  );
};
