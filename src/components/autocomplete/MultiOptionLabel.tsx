import { CrossFilled } from "../CrossFilled";
import { Option } from "./types";

interface MultiOptionLabelProps {
  selectedOption: Option;
  getStringValue: (option: Option) => string;
  getOptionLabel?: (option: Option) => string;
  onSelectedChange: (option: Option) => void;
};

export default function MultiOptionLabel({
  selectedOption,
  getStringValue,
  getOptionLabel,
  onSelectedChange,
}: MultiOptionLabelProps) {
  return (
    <div 
      key={getStringValue(selectedOption)} 
      className="w-max flex gap-1 justify-between items-center bg-gray-300 text-gray-800 text-sm px-3 py-1 rounded-full"
    >
      <span>
        { getOptionLabel ? getOptionLabel(selectedOption) : getStringValue(selectedOption) }
      </span>
      <div 
        onClick={() => onSelectedChange(selectedOption)}
        className="cursor-pointer"
      >
        <CrossFilled height={16} width={16} className="hover:text-red-800" />
      </div>
    </div>
  );
}