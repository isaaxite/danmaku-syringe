import { createSignal } from "solid-js";
import { InlineButton } from "../../src/Components/Common/Button";
import { TopDrawer } from "../../src/Components/Common/Drawer";
import { Page } from "./Component";

export default () => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [isOpen2, setIsOpen2] = createSignal(false);

  return (
    <Page>
      <div>
        <InlineButton onClick={() => setIsOpen(true)}>Toggle TopDrawer</InlineButton>
        <InlineButton onClick={() => setIsOpen2(true)}>Don't show CloseButton</InlineButton>
      </div>
      <TopDrawer
        open={isOpen()}
        onBackdropClick={() => setIsOpen(false)}
        className="z-1024"
      >
        <div className="px-40 py-20 text-center">TopDrawer Content</div>
      </TopDrawer>
      <TopDrawer
        open={isOpen2()}
        onBackdropClick={() => setIsOpen2(false)}
        showCloseButton={false}
        className="z-1024"
      >
        <div className="px-40 py-20 text-center">TopDrawer Content</div>
      </TopDrawer>
    </Page>
  );
};
