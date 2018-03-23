import React, { Component } from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';


console.clear();

const Title = ({todoCount}) => {
  return (
    <div>
       <div>
          <h1>to-do ({todoCount})</h1>
       </div>
    </div>
  );
}

const TodoForm = ({addTodo}) => {
  let input;

  return (
    <form onSubmit={(e) => {
        e.preventDefault();
        addTodo(input.value);
        
        input.value = '';
      }}>
      <input style = {{width: 200}} ref={node => {
        input = node;
      }} />
      <br />
    </form>
  );
};


const Todo = ({todo, remove}) => {
  console.log(todo);

  return (<div><a href="" onClick={() => {remove(todo._id)}}>{todo.todo}</a></div>);
}

const TodoList = ({todos, remove}) => {
  const todoNode = todos.map((todo) => {
    return (<Todo todo={todo} key={todo.id} remove={remove}/>)
  });

  console.log(todoNode);
 
  return (<div className="list-group" style={{marginTop:'30px'}}>{todoNode}</div>);
}

class App extends Component {

constructor(props){

    super(props);

    this.state = {
      data: []
    }
    this.apiUrl = 'http://localhost:8080/api/todos';
  }

	componentDidMount(){
    axios.get(this.apiUrl)
      .then((res) => {
        this.setState({data:res.data});
      });
  }

  addTodo(val){
    const todo = {"username": "nishanth2", "todo": val, "isDone": false, "hasAttachment": true};

    axios.post(this.apiUrl, todo)
       .then((res) => {
          this.state.data.push(res.data);
          this.setState({data: this.state.data});
       });
    
      //render();
  }
  
  handleRemove(id){
    const remainder = this.state.data.filter((todo) => {
      if(todo._id !== id) return todo;
    });
  
    axios.delete(this.apiUrl+'/'+id)
      .then((res) => {
        this.setState({data: remainder});
      })
  }

  render() {
    return (
      <div className="App">
	      <Title todoCount={this.state.data.length}/>
        <TodoForm addTodo={this.addTodo.bind(this)}/>
        <TodoList
          todos={this.state.data}
          remove={this.handleRemove.bind(this)}
        />
      </div>
    );
  }
}

export default App;
