import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const reducer = (state = 0, action) =>{
  switch (action.type) {
    case 'incrementar':
      return state +1
    
    case 'decrementar': 
      return state-1
    
    case 'set':
      return action.payload

    default:
      return state

  }
}
function App() {
  const [valor, setValor] = useState('')
  const dispatch= useDispatch()
  const state = useSelector(state => state)
  return (
    <div>
      <p>contador:{state} </p>
      <button onClick={()=>dispatch({type:'incrementar'})}>incrementar</button>
      <button onClick={()=>dispatch({type:'decrementar'})}>decrementar</button>
      <button onClick={()=>dispatch({type:'set', payload: valor})}>set</button>
      <input value={valor} onChange={e=>setValor(Number(e.target.value))}/>
    </div>
  );
}

export default App;