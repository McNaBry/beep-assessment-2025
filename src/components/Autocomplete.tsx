import { 
  autoUpdate, 
  flip, 
  FloatingFocusManager, 
  offset, 
  shift, 
  size, 
  useDismiss, 
  useFloating, 
  useFocus, 
  useInteractions, 
  useListNavigation, 
  useRole 
} from "@floating-ui/react";
import { JSX, useRef, useState } from "react";

export type Option = string | Object;
type FilterOption = Option;

type AutocompleteProps = {
  description?: string;
  disabled?: boolean;
  // filterOptions?: (options: FilterOption[]) => void;
  label?: string;
  // loading?: boolean;
  multiple?: boolean;
  onChange?: (value: string | Object) => void;
  // onInputChange?: (input: string | Object) => void;
  // options: Option[];
  placeholder?: string;
  // renderOption?: () => JSX.Element;
  value?: Option | Option[];

  // Additional props
  required?: boolean;
};

export default function Autocomplete(props: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Internal rendering of values
  const [inputValue, setInputValue] = useState<string>("");
  // To be replaced with reference to value prop passed in
  const [selectedValue, setSelectedValue] = useState<string>("");
  
  const options = ['one', 'two', 'two2', 'three'];
  // Simple filtering
  const filteredOptions = options.filter((option) => option.toLowerCase().startsWith(inputValue.toLowerCase()));
  
  const {refs, floatingStyles, context} = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      flip({ padding: 10 }),
      size({
        apply({ rects, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${availableHeight}px`,
          });
        },
        padding: 10,
      }),
      offset(5)
    ],
    whileElementsMounted: autoUpdate,
  });

  const listRef = useRef<Array<HTMLElement | null>>([]);
 
  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
    virtual: true,
    loop: true,
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

  // Auto select first choice by default
  function onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setInputValue(value);

    if (value) {
      setActiveIndex(0);
      setIsOpen(true);
    } else {
      setActiveIndex(null);
    }
  }

  // Checks with actual selected value not value currently in input
  function isSelected(value: string) {
    return selectedValue === value;
  }
  
  return (
    <div className="grid place-items-center">
      { props.label && <label htmlFor="autocomplete">{ props.label }</label> }
      <input 
        className=""
        id="autocomplete"
        value={inputValue}
        ref={refs.setReference}
        placeholder={props.placeholder}
        disabled={props.disabled}
        required={props.required ?? false}
        aria-autocomplete="list"
        onChange={onInputChange}
        {...getReferenceProps({
          onKeyDown(event) {
            if (
              event.key === "Enter" &&
              activeIndex != null &&
              options[activeIndex]
            ) {
              setSelectedValue(filteredOptions[activeIndex]);
              setInputValue(filteredOptions[activeIndex]); // Change this for multiple
            }
          },
        })}
      />
      {isOpen && (
        <FloatingFocusManager context={context} initialFocus={-1} modal={false} visuallyHiddenDismiss>
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              background: "#eee",
              color: "black",
              overflowY: "auto",
            }}
            {...getFloatingProps()}
          >
            {filteredOptions.map((option, index) => (
              <div
                key={option}
                className={index === activeIndex ? 'bg-blue-100' : (isSelected(option) ? 'bg-red-100' : '')}
                style={{

                }}
                {...getItemProps({
                  ref(node) {
                    listRef.current[index] = node;
                  },
                  onClick() {
                    setSelectedValue(option);
                    setInputValue(option); // Change this for multiple
                    if (!props.multiple) {
                      setIsOpen(false);
                    }
                  },
                })}
              >
                { isSelected(option) && <span className="" role="img" aria-label="check"> ✔️ </span> }
                {option}
              </div>
            ))}
          </div>
        </FloatingFocusManager>
      )}
      { props.description && <p className="">{props.description}</p> }
    </div>
  );
}