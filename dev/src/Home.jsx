import { Block, Page } from "./Component";
import { EntryBarView } from "../../src/EntryBar/View";
import EntryBar from "../../src/EntryBar";

export default () => {
  return (
    <Page>
      <Block>
        <EntryBarView onClickApplyBtn={(containerType, rest) => {
          console.info('EntryBar onClickInjectBtn', { containerType, rest })
        }}/>
      </Block>

      <Block>
        <EntryBar />
      </Block>
    </Page>
  );
};
