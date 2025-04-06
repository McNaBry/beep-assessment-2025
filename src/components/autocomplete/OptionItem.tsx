import { Option } from "./types";

interface OptionItemProps {
  index: number;
  activeIndex: number | null;
  option: Option;
  getStringValue: (option: Option) => string;
  getOptionLabel?: (option: Option) => string;
  isOptionSelected: (option: Option) => boolean;
};

export default function OptionItem({
  index,
  activeIndex,
  option,
  getOptionLabel,
  getStringValue,
  isOptionSelected,
}: OptionItemProps) {
  return (
    <div className={
      `cursor-pointer flex items-center justify-between py-1 px-5
      ${(index === activeIndex ? 'bg-gray-200' : (isOptionSelected(option) ? 'bg-blue-100' : ''))}`
    }>
      { getOptionLabel ? getOptionLabel(option) : getStringValue(option) }
      <input
        className="h-4 w-4 accent-[#2980b9]"
        type="checkbox"
        readOnly
        checked={isOptionSelected(option)}
      />
    </div>
  );
}