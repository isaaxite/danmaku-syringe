import { createSignal, Match, Show, Switch } from "solid-js";
import { Button, IconBUtton } from "../Component/Button";
import { DropdownMenu } from "../Component/Select";
import { DMWordsIcon, SyringeIcon } from "../Component/Svg";
import { Checkbox, TextInput } from "../Component/Input";
import { ContainerType } from "../constant";

export const EntryBarView = (props) => {
  const [containerType, setContainerType] = createSignal(ContainerType.Thereal)
  const [isExpanded, setIsExpanded] = createSignal(false);
  const [isInsertPointAuto, setIsInsertPointAuto] = createSignal(true);
  const [insertPath, setInsertPath] = createSignal('');

  return (
    <div className="flex flex-row justify-end overflow-hidden">
      <div className={`
        bg-gray-900 pt-2.5 pb-3 pr-3 pl-15 rounded-s-full transition-all relative
        ${isExpanded() ? 'translate-x-0' : 'translate-x-[calc(100%-3.1rem)]'}
      `}>

        <IconBUtton
          className="absolute left-1 top-1"
          onClick={() => setIsExpanded(!isExpanded())}
        >
          <DMWordsIcon class={`
            size-4 absolute top-2.5 left-3 origin-center
            transform-gpu transition-all duration-300
            ${isExpanded() ? 'delay-150 scale-200' : 'delay-100 scale-100'}
          `} />
          <SyringeIcon class={`
            size-8
            transform-gpu transition-all origin-center delay-150 duration-350
            ${isExpanded() ? '-translate-x-0.5 translate-y-0.5 skew-2' : 'skew-0 translate-x-0 translate-0'}
          `} />
        </IconBUtton>

        <DropdownMenu
          selected={containerType()}
          options={[
            { text: '替身容器', value: ContainerType.Substitute },
            { text: '真身容器', value: ContainerType.Thereal },
          ]}
          onChange={(value) => {
            console.info('onChange value:', value);
            setContainerType(value);
          }}
        />

        <Switch>
          <Match when={containerType() === ContainerType.Thereal}>
            <Checkbox
              label="插入点自动"
              labelClass="text-white"
              checked={isInsertPointAuto()}
              onChange={(checked) => {
                console.info('Checkbox onChange value: ', checked);
                setIsInsertPointAuto(checked);
              }}
            />

            <Show when={!isInsertPointAuto()}>
              <TextInput
                onChange={(value) => {
                  console.info('TextInput onChange value: ', value);
                  setInsertPath(value);
                }}
                placeholder="视频容器 querySelector 路径"
                className="w-42 mx-1"
              />
            </Show>

            <Button onClick={() => {
              props.onClickApplyBtn?.(containerType(), {
                isInsertPointAuto: isInsertPointAuto(),
                insertPath: insertPath(),
              });
            }}>注入</Button>
          </Match>
          <Match when={containerType() === ContainerType.Substitute}>
            <Button onClick={() => {
              props.onClickApplyBtn?.(containerType());
            }}>创建</Button>
          </Match>
        </Switch>
      </div>
    </div>
  );
};
