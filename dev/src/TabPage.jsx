import { InlineButton } from "../../src/Component/Button";
import { Tab, TabPage, TabPanel, TabPanels, Tabs } from "../../src/Component/TabPage";
import { Block, Page } from "./Component";

export default () => {
  return (
    <Page>
      <Block>
        <h2>无样式：</h2>
        <TabPage>
          <Tabs defIndex="Tab-2">
            <Tab index="Tab-1">Tab-1</Tab>
            <Tab index="Tab-2">Tab-2</Tab>
          </Tabs>
          <TabPanels>
            <TabPanel index="Tab-1">TabPanel-1</TabPanel>
            <TabPanel index="Tab-2">TabPanel-2</TabPanel>
          </TabPanels>
        </TabPage>
      </Block>

      <Block>
        <h2>样式-1：</h2>
        <TabPage>
          <Tabs defIndex="Tab-2" className="border justify-end">
            <Tab index="Tab-1" align="left" className="border border-amber-700">
              <InlineButton>Tab-1</InlineButton>
            </Tab>

            <Tab index="Tab-2" align="center" className="border border-amber-900">
              <InlineButton>Tab-2</InlineButton>
            </Tab>
            <Tab index="Tab-3" align="center" className="border border-amber-900">
              <InlineButton>Tab-3</InlineButton>
            </Tab>

            <Tab index="Tab-4" align="right" className="border border-amber-900">
              <InlineButton>Tab-4</InlineButton>
            </Tab>
          </Tabs>
          <TabPanels className="border border-b-blue-600 pb-30">
            <TabPanel index="Tab-1" className="border">TabPanel-1</TabPanel>
            <TabPanel index="Tab-2" className="border border-b-emerald-600">TabPanel-2</TabPanel>
          </TabPanels>
        </TabPage>
      </Block>
    </Page>
  );
};
