import { useState } from 'react'
import './App.css'
import Autocomplete, { Option } from './components/Autocomplete'

function App() {
  const [value, setValue] = useState<Option | null>(null);
  const [values, setValues] = useState<Option[]>([]);
  const [customOptionValues, setCustomOptionValues] = useState<Option[]>([]);
  
  return (
    <div className="justify-self-center flex flex-col gap-6 w-[300px]">
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
