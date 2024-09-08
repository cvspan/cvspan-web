import React from 'react';
import './style.css';

function App() {
    const [car, setCar] = React.useState({
        color: 'red',
        year: 1997,
        model: 'toyota',
        brand: 'pppp',
        other: '433434',
        dd: 'eee',
    });

    const [age, setAge] = React.useState(19);
    const [text, setText] = React.useState('');
    const [todos, setTodos] = React.useState([]);

    function submit() {
        const newArray = [...todos];
        newArray.push(text);

        setTodos(newArray);
    }

    function changeText(event) {
        setText(event.target.value);
    }

    return (
        <div>
            <h1>TODO LIST</h1>
            <input value={text} onChange={changeText} />
            <button onClick={submit}>Submit</button>

            <br />

            {todos.map(function (item, index) {
                return <p key={index}>{item}</p>;
            })}
        </div>
    );
}

export default App;
