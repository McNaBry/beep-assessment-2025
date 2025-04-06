import { 
  autoUpdate, 
  flip, 
  FloatingFocusManager, 
  offset,
  size, 
  useDismiss, 
  useFloating, 
  useFocus, 
  useInteractions, 
  useListNavigation, 
  useRole, 
  useTransitionStyles
} from "@floating-ui/react";
import { JSX, useEffect, useRef, useState } from "react";
import Spinner from "./Spinner";
import { CrossFilled } from "./CrossFilled";

export type Option = string | Object;

interface AutocompleteProps {
  description?: string;
  disabled?: boolean;
  filterOptions?: (option: Option, inputValue: string) => boolean;
  label?: string;
  loading?: boolean;
  multiple?: boolean;
  onChange?: (value: Option | Option[] | null) => void;
  onInputChange?: (input: string) => void;
  options: Option[];
  placeholder?: string;
  renderOption?: (option: Option, index: number, isActive: boolean, isSelected: boolean) => JSX.Element;
  value?: Option | Option[] | null;
};

export default function Autocomplete({
  description,
  disabled,
  filterOptions,
  label,
  loading = false,
  multiple = false,
  onChange,
  onInputChange,
  options,
  placeholder,
  renderOption,
  value,
}: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const [inputValue, setInputValue] = useState<string>('');
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const selected: Option | Option[] | null = value ?? null;
  
  const {refs, floatingStyles, context} = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      flip({ padding: 10 }),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${200}px`,
          });
        },
        padding: 10,
      }),
      offset(5)
    ],
    whileElementsMounted: autoUpdate,
  });

  const {styles} = useTransitionStyles(context, {
    duration: 200,
  });

  const listRef = useRef<Array<HTMLElement | null>>([]);
  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    loop: true,
    focusItemOnOpen: true,
  });

  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const {getReferenceProps, getFloatingProps, getItemProps} = useInteractions([
    focus,
    dismiss,
    role,
    listNavigation
  ]);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (filterOptions) {
        setFilteredOptions(options.filter((option => filterOptions(option, inputValue))));
      } else {
        // Simple prefix matching
        const filtered = options.filter((option) => 
          getStringValue(option).toLowerCase().startsWith(getStringValue(inputValue).toLowerCase()));
        setFilteredOptions(filtered);
      }
    }, 1000)
    
    return () => {
      clearTimeout(timeoutId);
    }
  }, [inputValue]);

  // Auto select first choice by default
  function onValueChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setInputValue(value);

    if (value) {
      setActiveIndex(0);
      setIsOpen(true);
    } else {
      setActiveIndex(null);
    }

    if (onInputChange) {
      onInputChange(value);
    }
  }

  // Helper function to handle changes in selected value(s)
  function onSelectedChange(option: Option) {
    if (option != null && isOptionSelected(option)) {
      setInputValue('');
      if (onChange && !multiple) {
        onChange(null);
      } else if (onChange && multiple) {
        const newResults = (selected as Option[]).filter(
          (selectedOption) => getStringValue(selectedOption) != getStringValue(option));
        onChange(newResults);
      }
    } else {
      if (!multiple) {
        setInputValue(getStringValue(option));
        if (onChange) {
          onChange(option);
        }
      } else {
        const oldResults = selected as Option[];
        setInputValue('');
        if (onChange) {
          onChange([...oldResults, option]);
        }
      }
    }
  }

  // Helper method to extract string values from chosen options
  function getStringValue(option: Option | null): string {
    if (option == null) {
      return '';
    }

    if (typeof option === "string") {
      return option;
    } else {
      return JSON.stringify(option);
    }
  }

  // Helper method to check if value has been selected by user
  function isOptionSelected(option: Option): boolean {
    if (multiple) {
      if (selected == null) {
        return false;
      }
      const res = (selected as Option[]).filter(
        (selectedOption) => getStringValue(option) === getStringValue(selectedOption));
      
      return res.length > 0 ? true : false;
    } else {
      return getStringValue(option) === getStringValue(selected);
    }
  }

  function clearSelected() {
    if (multiple && onChange) {
      onChange([]);
    } else if (onChange) {
      onChange(null);
    }
    setInputValue('');
  }
  
  return (
    <div className="w-full max-w-full flex flex-col items-start gap-1">
      { label && <label className="text-gray-600" htmlFor="autocomplete">{ label }</label> }
      <div className={
        `min-w-[200px] w-full max-w-full flex gap-1 p-2 justify-between items-center
        border border-gray-300 rounded-sm focus-within:border-blue-500
        ${disabled ? 'cursor-not-allowed bg-gray-100' : (loading ? 'cursor-progress' : "")}`
      } ref={refs.setReference}>
        <div className="w-full flex flex-wrap gap-1 cursor-inherit">
          { multiple && (selected as Option[]).length > 0 &&
            <>
              { (selected as Option[]).map((selectedOption) => (
                  <div className="w-max flex items-center bg-gray-300 text-gray-800 text-sm px-3 py-1 rounded-full">
                    <span>
                      {getStringValue(selectedOption)}
                    </span>
                  </div>
                ))
              }
            </>
          }
          <input 
            className={`w-full focus:outline-none ${loading || disabled ? "pointer-events-none" : ""}`}
            id="autocomplete"
            value={inputValue}
            placeholder={placeholder}
            disabled={disabled || loading}
            aria-autocomplete="list"
            onChange={onValueChange}
            {...getReferenceProps({
              onKeyDown(event) {
                if (
                  event.key === "Enter" &&
                  activeIndex != null &&
                  options[activeIndex]
                ) {
                  onSelectedChange(filteredOptions[activeIndex]);
                } 
              },
            })}
          />
          { isOpen && (
            <FloatingFocusManager context={context} initialFocus={-1} modal={false}>
              <div
                ref={refs.setFloating}
                className="py-2 bg-white text-black overflow-y-auto rounded-sm"
                style={{
                  ...floatingStyles,
                  ...styles,
                  border: "1px solid",
                  borderColor: "#d1d5db"
                }}
                {...getFloatingProps()}
                onMouseDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
              >
                {filteredOptions.length > 0 ? (
                  <>
                    {filteredOptions.map((option, index) => {
                      return (
                        <div
                          key={getStringValue(option)}
                          {...getItemProps({
                            ref(node) {
                              listRef.current[index] = node;
                            },
                            onMouseDown() {
                              onSelectedChange(option);
                            },
                          })}
                        >
                          { renderOption
                            ? renderOption(option, index, index === activeIndex, isOptionSelected(option))
                            : <div className={
                                `cursor-pointer flex items-center justify-between py-1 px-5
                                ${(index === activeIndex ? 'bg-gray-200' : (isOptionSelected(option) ? 'bg-blue-100' : ''))}`
                              }>
                                { getStringValue(option) }
                                <input
                                  className="h-4 w-4 accent-[#2980b9]"
                                  type="checkbox"
                                  checked={isOptionSelected(option)}
                                />
                              </div>
                          }
                        </div>
                      )
                    })}
                  </>
                  ) : (
                    <span className="block pl-5 text-left text-gray-600">No results found.</span>
                  )
                }
              </div>
            </FloatingFocusManager>
          )}
        </div>
        { loading
          ? <Spinner /> 
          : !disabled && Array.isArray(selected) && (selected as Option[]).length > 0 || (!Array.isArray(selected) && selected != null)
            ? <div onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                clearSelected();
              }}>
                <CrossFilled />
              </div>
            : <></>
        }
      </div>
      { description && <p className="text-gray-600">{ description }</p> }
    </div>
  );
}