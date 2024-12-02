import { Editable } from "@chakra-ui/react/editable";
import { IconButton } from "@chakra-ui/react";
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu";
import { useEffect, useState } from "react";
import { ValueChangeDetails } from "@zag-js/tabs";

type Props = {
  value?: string;
  onChange: (value: string) => void;
};

export default function EditableInput({ value, onChange }: Props) {
  const [_value, _setValue] = useState<string>();

  useEffect(() => {
    if (value) {
      _setValue(value);
    }
  }, [value]);

  function onCommit({ value }: ValueChangeDetails) {
    _setValue(value);
    onChange(value);
  }

  return (
    <Editable.Root
      defaultValue="Click to edit"
      onValueCommit={onCommit}
      value={_value}
      onValueChange={({ value }) => _setValue(value)}
    >
      <Editable.Preview />
      <Editable.Input></Editable.Input>
      <Editable.Control>
        <Editable.EditTrigger asChild>
          <IconButton variant="ghost" size="xs">
            <LuPencilLine />
          </IconButton>
        </Editable.EditTrigger>
        <Editable.CancelTrigger asChild>
          <IconButton variant="outline" size="xs">
            <LuX />
          </IconButton>
        </Editable.CancelTrigger>
        <Editable.SubmitTrigger asChild>
          <IconButton variant="outline" size="xs">
            <LuCheck />
          </IconButton>
        </Editable.SubmitTrigger>
      </Editable.Control>
    </Editable.Root>
  );
}
