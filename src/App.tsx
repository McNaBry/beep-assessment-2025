import { useState } from 'react'
import './App.css'
import Autocomplete from './components/Autocomplete'

function App() {
  const [value, setValue] = useState<string>('');
  return (
    <>
      <Autocomplete 
        label='Autocomplete'
        description='I am a description'
        value={value}
        onChange={(value: string | Object) => setValue(value.toString())}
        placeholder='Enter a value'
      />
    </>
  )
}

export default App
