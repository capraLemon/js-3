import { Select } from './select';
import { createMachine } from './machine';
import { keyboardHandler, inputHandler } from './handlers';
import { debounce } from './helpers';
import { SEARCH_TIME_DELAY } from './consts';


function createSelect(userSelectWrapper) {
    const select = new Select(userSelectWrapper);
    const selectStateMachine = createMachine(select);

    select.onMousedown(() => event.preventDefault());

    select.onMousedownInput(() => event.stopPropagation());

    select.onClick(() => select.inputField.focus());

    select.onFocus(() => selectStateMachine.transition('open', 'Type to search...'));

    select.onBlur(() => selectStateMachine.transition('close'));

    select.onInput(() => {
        if (event.target.value.length) {
            event.target.style.width = `${event.target.value.length * 13}px`;
        } else {
            event.target.style.width = '1px';
        }
    });

    select.onKeydown(keyboardHandler(selectStateMachine));

    select.onClear(() => selectStateMachine.transition('clearAll'));

    let debouncedInputHandler = debounce(inputHandler(selectStateMachine), SEARCH_TIME_DELAY);
    select.onInput(debouncedInputHandler);
}

export {createSelect};