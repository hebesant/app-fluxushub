import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ListFieldProps = {
  label: string;
  value: string;
  availableLists: string[];
  onChange: (value: string) => void;
};

export function ListField({
  label,
  value,
  availableLists,
  onChange,
}: ListFieldProps) {
  const [isCreatingNew, setIsCreatingNew] = useState(
    Boolean(value && !availableLists.includes(value))
  );

  const selectValue = isCreatingNew ? "__new__" : value || "__none__";

  return (
    <label className="block">
      <Label>{label}</Label>
      <Select
        value={selectValue}
        onValueChange={(nextValue) => {
          if (nextValue === "__new__") {
            setIsCreatingNew(true);
            onChange("");
            return;
          }

          setIsCreatingNew(false);
          onChange(nextValue === "__none__" ? "" : nextValue);
        }}
      >
        <SelectTrigger className="mt-2">
          <SelectValue placeholder="Selecione uma lista" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__none__">Sem lista</SelectItem>
          {availableLists.map((listName) => (
            <SelectItem key={listName} value={listName}>
              {listName}
            </SelectItem>
          ))}
          <SelectItem value="__new__">Criar nova lista</SelectItem>
        </SelectContent>
      </Select>

      {isCreatingNew ? (
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Nome da nova lista"
          className="mt-2 h-11"
        />
      ) : null}
    </label>
  );
}
