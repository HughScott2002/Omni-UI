import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

interface SearchInputProps {
  type: "mobile" | "desktop";
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const SearchInput = ({
  type = "desktop",
  value,
  onChange,
  placeholder = "Search",
}: SearchInputProps) => {
  const inputProps = {
    type: "search" as const,
    placeholder,
    // Only controlled when a handler is provided — existing uncontrolled
    // usages keep working.
    ...(onChange
      ? {
          value: value ?? "",
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value),
        }
      : {}),
  };

  if (type === "mobile") {
    return (
      <div className="mt-20 mb-0 pb-0 ">
        <div className="relative">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-fill text-black-1" />
          <Input {...inputProps} className="pl-10 text-black-1 w-fill" />
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex size-full items-center space-x-2 mr-0 ">
        <div className="relative size-full">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-fill text-black-1" />
          <Input
            {...inputProps}
            className="pl-10 font-semibold text-sm text-black-1 w-full h-full"
          />
        </div>
      </div>
    );
  }
};

export default SearchInput;
