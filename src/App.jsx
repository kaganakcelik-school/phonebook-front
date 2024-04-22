import { useState, useEffect } from "react";
import axios from 'axios'
import personService from './services/persons'
import './index.css'

const Notification = ({ message, color }) => {
	if (message === null) {
		return null
	}

	const style = {
		color: color,
		background: 'lightgray',
		fontSize: 20,
		borderStyle: 'solid',
		borderRadius: 5,
		padding: 10,
		marginBottom: 10
	}
	
	return (
		<div style={style}>
			{message}
		</div>
	)
}

const Persons = props => {
	
	
	//props.deletePerson(person.id)
	return (
		<ul>
			{props.persons.filter((person) => person.name.includes(props.filter)).map((person) => (
					<li key={person.id}>
						{person.name} {person.number}
						<button onClick={() => {props.deletePerson(person.id)}}>delete</button>
						{/* <button onClick={console.log('asdasd')}>tesintg</button> */}
					</li>
			))}
		</ul>
	)
}

const PersonForm = props => {
	return (
		<form onSubmit={props.addName}>
			<div>
				name: <input value={props.newName} onChange={props.handleNameChange} />
			</div>
			<div>
				number: <input value={props.newNumber} onChange={props.handleNumberChange} />
			</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	)
}

const Filter = props => {
	return (
		<div>
			filter shown with <input value={props.filter} onChange={props.handleFilterChange} />
		</div>
	)
}

// { name: "Arto Hellas", number: "040-123456", id: 1 },
// { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
// { name: "Dan Abramov", number: "12-43-234345", id: 3 },
// { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("");
	const [filter, setFilter] = useState("");
	const [addMessage, setAddMessage] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);

	useEffect(() => {
		personService
			.getAll()
			.then(initialPersons => {
				setPersons(initialPersons);
			})
	}, [])

	const deletePerson = id => {		
		if (window.confirm(`Delete ${persons.find(person => person.id === id).name}?`)) {
			console.log(`deleting ${id}`)

			personService
				.remove(id)
				.then(response => {
					setPersons(persons.filter(person => person.id !== id))
				})
				.catch(error => {
					setPersons(persons.filter(person => person.id !== id))
					setErrorMessage(
						`Information of ${persons.find(person => person.id === id).name} has already been removed from server`
					)
					setTimeout(() => {
						setErrorMessage(null)
					}, 3000)
				})
		}
		
		
	}

	const testingap = () => {
		console.log('gang frfr')
	}

	const addName = (event) => {
		event.preventDefault();

		if (!persons.every((person) => person.name != newName)) {
			// alert(`${newName} is already added to phonebook`);
			// setNewName("");
			if (window.confirm(`${newName} is already added phonebook, replace the old number with a new one?`))
			{
				const personToChange = persons.find(p => p.name === newName)
				const changedPerson = { ...personToChange, number: newNumber}

				personService
					.update(personToChange.id, changedPerson)
					.then(
						setPersons(persons.map(p => p.id === personToChange.id ? changedPerson : p))
					)
			}
			// else {
				
			// }
			setNewName("");
			setNewNumber("");
			return;
		} else if (!persons.every((person) => person.number != newNumber)) {
			alert(`${newNumber} is already added to phonebook`);
			setNewNumber("");
			return;
		}

		console.log(newName);

		const nameObject = {
			name: newName,
			number: newNumber
		};

		
		

		personService
			.create(nameObject)
			.then(returnedNote => {
				setPersons(persons.concat(returnedNote))
				setAddMessage(
					`Added ${newName}`
				)
				setTimeout(() => {
					setAddMessage(null)
				}, 3000)
				setNewName('')
				setNewNumber('')
			})
			.catch(error => {
				setErrorMessage(
					error.response.data.error
				)
				setTimeout(() => {
					setErrorMessage(null)
				}, 3000)
			})
	};

	const handleNameChange = (event) => {
		setNewName(event.target.value);
	};

	const handleNumberChange = (event) => {
		setNewNumber(event.target.value);
	};

	const handleFilterChange = (event) => {
		setFilter(event.target.value);
	};

	return (
		<div>
			<h2>Phonebook</h2>	
			<Notification message={addMessage} color='green'/>
			<Notification message={errorMessage} color='red'/>
			<Filter filter={filter} handleFilterChange={handleFilterChange}/>
			
			<h3>add a new</h3>
			<PersonForm 
				addName={addName}
				newName={newName}
				handleNameChange={handleNameChange}
				newNumber={newNumber}
				handleNumberChange={handleNumberChange}
			/>
			
			<h2>Numbers</h2>
			<Persons persons={persons} filter={filter} deletePerson={deletePerson}/>
		</div>
	);
};

export default App;
