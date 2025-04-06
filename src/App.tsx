import { useState } from 'react'
import './App.css'
import Autocomplete, { Option } from './components/Autocomplete'

function App() {
  const [value, setValue] = useState<Option | null>(null);
  const [values, setValues] = useState<Option[]>([]);
  const [customOptionValues, setCustomOptionValues] = useState<Option[]>([]);
  const [customObjectValues, setCustomObjectValues] = useState<Option[]>([]);
  
  return (
    <div className="flex flex-col gap-6 w-[300px]">
      <Autocomplete 
        label='Single Select'
        description='Only one option can be selected'
        value={value}
        onChange={(value) => setValue(value)}
        placeholder='Enter a value'
        options={["one", "one1", "one2", "two", "two2", "three", "four", "five", "six", "eight", "nine", "ten"]}
      />

      <Autocomplete 
        label='Multi Select'
        description='Multiple options can be selected'
        multiple={true}
        value={values}
        onChange={(values) => {
          const newValues = values as Option[] ?? [];
          setValues(newValues);
        }}
        placeholder='Enter a value'
        options={["one", "one1", "one2", "two", "two2", "three", "four", "five", "six", "eight", "nine", "ten"]}
      />

      <Autocomplete 
        label='Multi Select (with Objects)'
        description='Date objects with custom comparator and label'
        multiple={true}
        value={customObjectValues}
        onChange={(values) => {
          const newValues = values as Option[] ?? [];
          setCustomObjectValues(newValues);
        }}
        placeholder='Enter a value'
        options={[
          new Date('2025-04-01'),
          new Date('2024-02-29'),
          new Date('2025-10-31'),
          new Date('2025-12-25'),
          new Date('2025-07-04'),
          new Date('2025-06-21'),
          new Date('2025-11-05'),
          new Date('2025-05-04'),
          new Date('2025-09-13'),
          new Date('2025-03-14'), 
        ]}
        filterOptions={(option, inputValue) => {
          if (inputValue === "") {
            return true;
          }
          const dateOption = option as Date;
          const dateValue = `${dateOption.getDate()}/${dateOption.getMonth()}/${dateOption.getFullYear()}`
          return dateValue.startsWith(inputValue);
        }}
        getOptionLabel={(option) => {
          const dateOption = option as Date;
          return `${dateOption.getDate()}/${dateOption.getMonth()}/${dateOption.getFullYear()}`
        }}
      />

      <Autocomplete 
        label='Custom Option Design'
        description='Option design can be customised'
        multiple={true}
        value={customOptionValues}
        onChange={(values) => {
          const newValues = values as Option[] ?? [];
          setCustomOptionValues(newValues);
        }}
        placeholder='Enter a value'
        options={["one", "one1", "one2", "two", "two2", "three", "four", "five", "six", "eight", "nine", "ten"]}
        renderOption={(option, index, active, selected) => {
          let content = '';
          if (typeof option === "string") {
            content = option;
          } else {
            content = JSON.stringify(option);
          }
          return (
            <div
              key={content}
              className={
                `cursor-pointer flex items-center justify-between py-1 px-5
                ${(active ? 'bg-purple-200' : (selected ? 'bg-red-100' : ''))}`
              }
            >
              {index} - {content}
            </div>
          );
        }}
      />

      <Autocomplete 
        label='Loading State'
        description='I am still loading my options'
        loading={true}
        value={values}
        placeholder='Enter a value'
        options={[]}
      />

      <Autocomplete 
        label='Disabled State'
        description='I am disabled'
        disabled={true}
        value={values}
        placeholder='Enter a value'
        options={[]}
      />
    </div>
  )
}

export default App
