import EntryBar from "../../src/Components/EntryBar";
import { Page } from "./Component";

export default () => {
  return (
    <Page>
      <EntryBar onClickApplyBtn={(...rest) => {
        console.info(...rest);
      }} />
    </Page>
  );
};
