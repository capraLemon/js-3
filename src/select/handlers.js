import { MIN_NUMBER_OF_CHARACTERS_TO_SEARCH } from './consts';


const keyboardHandler = (selectStateMachine) => (event) => {
    if (selectStateMachine.currentState === 'filled') {
        switch (event.key) {
            case "Escape":
                selectStateMachine.transition('close');
                break;
            case "ArrowUp":
                event.preventDefault();                
                selectStateMachine.transition('moveFocusUp');
                break;
            case "ArrowDown":
                event.preventDefault();
                selectStateMachine.transition('moveFocusDown');
                break;
            case "Enter":
                selectStateMachine.transition('select');
                break;
            default:
                break;
        }
    } else {
        switch (event.key) {
            case "Escape":
                selectStateMachine.transition('close');
                break;
            case "ArrowUp":
                event.preventDefault();
                break;
            case "ArrowDown":
                event.preventDefault();
                break;
            default:
                break;
        }
    }
}

const inputHandler = (selectStateMachine) => (event) => {
    if (event.target.value.length < MIN_NUMBER_OF_CHARACTERS_TO_SEARCH) {
        selectStateMachine.transition('open', 'Type to search...');
        return;
    }
    selectStateMachine.transition('open', 'Search in progress...');
    selectStateMachine.transition('search', event.target.value);
}

const mousedownHandler = (selectStateMachine) => (event) => {
    selectStateMachine.transition('select');
}


export { keyboardHandler, inputHandler };