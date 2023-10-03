import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { combineReducers } from "redux"

export const asyncMiddleware = store => next => action =>{
    if(typeof action === 'function'){
        return action(store.dispatch, store.getState)
    }
    return next(action)
}

export const fetchthunk = () => async dispatch =>{
    dispatch({type: 'todos/pending'})
    try{
        const response = await fetch('https://jsonplaceholder.typicode.com/todos')
        const data = await response.json()
        const todos = data.slice(0, 10)
        dispatch({type: 'todos/fullfilled', payload: todos})
    }catch(e){
        dispatch({type: 'todos/error', error: e.message})
    }
}

export const filterReducer = (state='all', action) =>{
    switch(action.type){
        case'filter/set':
            return action.payload
        default:
            return state
    }

}

const initialFetching = {loading: 'idle', error: null}
export const fetchingReducer = (state=initialFetching, action) =>{
    switch(action.type){
        case 'todos/pending':{
            return {...state, loading: 'pending'}
        }
        case 'todos/fullfiled':{
            return {...state, loading: 'succeded'}
        }
        case 'todos/error':{
            return{error: action.error, loading:'rejected'}
        }
        default:
            return state
    }

}

export const todosReducer = (state=[], action) =>{
    switch(action.type){
        case 'todos/fullfilled':{
            return action.payload
        }
        case 'todo/add':{
            return state.concat({...action.payload})
        }

        case 'todo/completed':{
            const newTodos = state.map(todo=>{
                if(todo.id === action.payload.id){
                    return{...todo, completed: !todo.completed}
                }
                return todo
            })
            return newTodos

        }
    default: 
    return state
    }
}

export const reducer = combineReducers({
    todos: combineReducers({
        entities: todosReducer,
        status: fetchingReducer
    }),
    filter: filterReducer,
})


const selectTodos = (state) =>{
    const {todos: {entities}, filter} = state
    if (filter === 'completed') {
        return entities.filter(todo => todo.completed)
    }

    if (filter === 'incompleted') {
        return entities.filter(todo => !todo.completed)
    }
    return entities
}

const selectStatus = state => state.todos.status

const Todoitem = ({todo}) =>{
    const dispatch = useDispatch()
    return(
        <li 
        style={{textDecoration: todo.completed ? 'line-through': 'none'}}
        onClick={()=> dispatch({type: 'todo/completed', payload: todo})}>{todo.title} </li>
    )
}


const App = () =>{
    const [value, setValue] = useState('')
    const dispatch = useDispatch()
    const todos = useSelector(selectTodos)
    const status = useSelector(selectStatus)

    const submit = (e) => {
        e.preventDefault()
        if (!value){
            return
        }
        const id = Math.random().toString()
        const todo = {
            title: value,
            completed: false,
            id
        }
        dispatch({type:'todo/add', payload: todo})
        setValue('')
    }

    if (status.loading === 'pending'){
        return (<p>cargando...</p>)
    }
    return(

        <div>
        <form onSubmit={submit}>
            <input value={value} onChange={e => setValue(e.target.value)}/>
        </form>
        <button onClick={()=> dispatch({type: 'filter/set', payload:'all'})}>mostrar todos</button>
        <button onClick={()=> dispatch({type: 'filter/set', payload:'completed'})}>completados</button>
        <button onClick={()=> dispatch({type: 'filter/set', payload:'incompleted'})}>incompletos</button>
        <button onClick={()=> dispatch(fetchthunk())}>fetch</button>
        <ul>
        {todos.map(todo => <Todoitem key={todo.id} todo={todo} />)}
        </ul>
    </div>
)
}
export default App