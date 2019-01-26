import './styles.css'
import { machine, useContext, useState } from './my-state-machine';

const classSelectWrapper = 'select-wrapper';
const classSelectInput = 'select-input';
const classSelectInputInputField = 'select-input__input-field';
const classSelectInputClearIcon = 'select-input__clear-icon';
const classFas = 'fas';
const classFaTimes = 'fa-times';
const classSelectVariantsWrapper = 'select-variants-wrapper';
const classSelectVariants = 'select-variants';
const classSelectVariantsElement = 'select-variants__element';
const classSelectVariantsElementEmpty = 'select-variants__element_empty'

const STYLE_SELECT_WRAPPER = 'select-wrapper';
const STYLE_SELECT_INPUT = 'select-input-wrapper';
const STYLE_SELECT_INPUT_FIELD = 'select-input__input-field';
const STYLE_SELECT_INPUT_CLEARICON = 'select-input__clear-icon';
const STYLE_ICONS = 'fas';
const STYLE_ICON_CLEAR = 'fa-times';
const STYLE_SELECT_SEARCHED_VARIANTS_WRAPPER = 'select-searched-variants-wrapper';
const STYLE_SELECT_SEARCHED_VARIANTS = 'select-searched-variants';
const STYLE_SELECT_SEARCHED_VARIANTS_ELEMENT = 'select-searched-variants__element';
const STYLE_SELECT_SEARCHED_VARIANTS_ELEMENT_DEFAULT = 'select-searched-variants__element_default';
const STYLE_SELECTED_ELEMENT = 'select-input-wrapper__selected-element'
// const STYLE_SELECTED_ELEMENT_WRAPPER = 'select-input-wrapper__selected-element-wrapper'

const SELECT_FOCUS_COLOR = 'rgb(0, 119, 255, 0.2)';
const SELECT_DEFAULT_COLOR = 'rgb(255, 255, 255)';

const MIN_NUMBER_OF_ELEMENTS_TO_SEARCH = 2;
const TIME_DELAY_TO_SEARCH = 400;

function createElementWithClass(element, elementClass='') {
    let outputElement = document.createElement(element);
    outputElement.className = elementClass;
    return outputElement;
}

function deleteAllChildren(parent) {
    while (parent.hasChildNodes()) {
        parent.removeChild(parent.lastChild);
    }
}


function createSelect(userSelectWrapper) {

    // let initialStateDiv = createElementWithClass('div', classSelectVariantsElementEmpty);
    // initialStateDiv.innerHTML = 'Type to search';


    let selectWrapper = createElementWithClass('div', classSelectWrapper);
    let inputWrapper = createElementWithClass('div', classSelectInput);
    let inputField = createElementWithClass('input', classSelectInputInputField);
    inputField.placeholder = 'Select...';
    let searchedVariantsWrapper = createElementWithClass('div', classSelectVariantsWrapper);
    let searchedVariants = createElementWithClass('div', classSelectVariants);

    
    

    inputWrapper.append(inputField);
    selectWrapper.append(inputWrapper);
    searchedVariantsWrapper.append(searchedVariants);
    selectWrapper.append(searchedVariantsWrapper);
    userSelectWrapper.append(selectWrapper);


    


    let selectDomElements = {}
    Object.assign(selectDomElements, inputWrapper, selectWrapper, searchedVariantsWrapper, selectWrapper, userSelectWrapper)

    let currentFocus = undefined;  //????????????????????????????????????
    
    // GOOD !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // for all functions selectStateMachine, searchedVariantsWrapper
    function openState() {
        selectStateMachine.transition('open', 'Type to search...');
    }
    function closeState() {
        selectStateMachine.transition('close');
    }
    function clearState(event) {
        selectStateMachine.transition('clear', event.target);
    }
    function fillTransition(element) {
        selectStateMachine.transition('fill', element);
    }

    const selectStateMachine = machine({
        initialState: 'closed',
        context: { 
            textInSearchList: '', 
            currentFocus: undefined, 
            searchResults: new Set(), 
            selectedVariants: new Set() 
        },
        states: {
            'empty': {
                onEntry: 'enterEmptyListState',
                on: {
                    close: {
                        service: (element) => {
                            const [_, setState] = useState();
                            setState('closed');
                        }
                    },
                    open: {
                        service: (element) => {
                            const [_, setState] = useState();
                            const [context, setContext] = useContext();
                            setContext( {textInSearchList: element} )
                            setState('empty');
                        }
                    },
                    clear: {
                        service: (element) => {
                            const [context, setContext] = useContext();
                            const [state, setState] = useState();
                            // delete context.selectedVariants[element.parentElement.textContent]
                            context.selectedVariants.delete(element.parentElement.textContent)
                            element.parentElement.remove()
                            setState('closed');
                        },
                    },
                    fill: {
                        service: (element) => {
                            const [state, setState] = useState();
                            const [_, setContext] = useContext();
                            setState('filled');
                        },
                    }
                },
            },
            'closed': {
                onEntry: 'enterClosedListState',
                on: {
                    close: {},
                    open: {
                        service: (element) => {
                            const [_, setState] = useState();
                            const [context, setContext] = useContext();
                            setContext( {textInSearchList: element} )
                            setState('empty');
                        },
                    },
                    clear: {
                        service: (element) => {
                            const [context, setContext] = useContext();
                            const [state, setState] = useState();
                            // delete context.selectedVariants[element.parentElement.textContent]
                            context.selectedVariants.delete(element.parentElement.textContent)
                            element.parentElement.remove()
                            setState('closed');
                        },
                    },
                    fill: {},
                },
            },
            'filled': {
                onEntry: 'enterFilledListState',
                on: {
                    close: {
                        service: (element) => {
                            const [_, setState] = useState();
                            setState('closed');
                        }
                    },
                    open: {
                        service: (element) => {
                            const [_, setState] = useState();
                            const [context, setContext] = useContext();
                            setContext( {textInSearchList: element} )
                            setState('empty');
                        },
                    },
                    clear: {
                        service: (element) => {
                            const [context, setContext] = useContext();
                            const [state, setState] = useState();
                            // delete context.selectedVariants[element.parentElement.textContent]
                            context.selectedVariants.delete(element.parentElement.textContent)
                            element.parentElement.remove()
                            setState('closed');
                        },
                    },
                    select: {
                        service: (element) => {
                            const [state, setState] = useState();
                            const [context, setContext] = useContext();
                            let icon = createElementWithClass('div', classSelectInputClearIcon + ' ' + classFas + ' ' + classFaTimes)
                            let selectedElement = createElementWithClass('div', STYLE_SELECTED_ELEMENT);
                            selectedElement.innerHTML = element
                            selectedElement.append(icon)
                            inputWrapper.insertBefore(selectedElement, inputField)
                            // icon.addEventListener('click', clearState, false)
                            icon.addEventListener('mousedown', clearState, false)

                            // let newSelectedVariants = context.selectedVariants
                            // newSelectedVariants[element] = null
                            // setContext( {selectedVariants: newSelectedVariants} )

                            context.selectedVariants.add(element)


                            // let az = new Set()
                            // setContext( {az} )

                            setState('closed');

                        },
                    },
                    fill: {
                        service: (element) => {
                            const [_, setState] = useState();
                            setState('filled');
                        },
                    }
                },
            },
        },
        actions: {
            enterEmptyListState: () => {
                console.log('enter empty')
                const context = useContext()[0];
                // currentFocus = undefined;
                deleteAllChildren(searchedVariants)
                drawEmptyResult(searchedVariants, context.textInSearchList)
                inputField.removeEventListener('keydown', keyboardActionsFilledState, false)
                inputField.addEventListener('keydown', keyboardActionsEmptyState, false)

                inputField.focus() 
            },
            enterClosedListState: () => {
                console.log('enter close')
                const context = useContext()[0];
                // currentFocus = undefined;
                searchedVariants.parentElement.style.display = 'none'; //element or node?
                deleteAllChildren(searchedVariants)
                inputField.value = '';
                inputField.blur();
                // isVariants = False ??????????????????????????????????????????
                inputField.removeEventListener('keydown', keyboardActionsFilledState, false)
                inputField.removeEventListener('keydown', keyboardActionsEmptyState, false)

                // context.textInSearchList = 'Type to search...'
            },
            enterFilledListState: () => {
                console.log('enter filled')
                const context = useContext()[0];
                deleteAllChildren(searchedVariants)
                drawSearchResults(context.searchResults, searchedVariants, classSelectVariantsElement)
                addListenersToSearchResults(searchedVariants, selectStateMachine)
                giveFocus(searchedVariants)
                inputField.removeEventListener('keydown', keyboardActionsEmptyState, false)
                inputField.addEventListener('keydown', keyboardActionsFilledState, false)              
            },

        },
    });
   


    // let RESULT_GLOBAL = new Set();

    // removeSelectedResults(selectStateMachine, context.selectedVariants)
    // removeSelectedResults(RESULT_GLOBAL)       
    function removeSelectedResults(foundVariantsList) {
        console.log('remove selected result')
        // Object.keys(selectStateMachine.context.selectedVariants).forEach((selectedVariant, i) => {
        selectStateMachine.context.selectedVariants.forEach((selectedVariant, i) => {
            if (foundVariantsList.has(selectedVariant)) {
                foundVariantsList.delete(selectedVariant)
            }
        })
    }

    // makeInputWrap() GOOD!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    function makeInputWrap(event) {
        if (event.target.value.length) {
            event.target.size = event.target.value.length;
        } else {
            event.target.size = 1
        }
    }

    function inputHandler() {

    }

    // searchAndAddListeners(RESULT_GLOBAL, selectStateMachine, searchedVariantsWrapper)
    async function searchAndAddListeners(event) {
        // RESULT_GLOBAL.clear()
        selectStateMachine.context.searchResults.clear()
        if (event.target.value.length < MIN_NUMBER_OF_ELEMENTS_TO_SEARCH) {
            selectStateMachine.transition('open', 'Type to search...')
            return
        }
        // search in progress??????????????
        let timeout = setTimeout(() => selectStateMachine.transition('open', 'Search in progress...'), 200)//?????
        

        await searchAndSaveElements(event.target.value, selectStateMachine.context.searchResults)
        clearTimeout(timeout);
        removeSelectedResults(selectStateMachine.context.searchResults)

        if (!(selectStateMachine.context.searchResults).size) {
            selectStateMachine.transition('open', 'Nothing found')
            return
        }
        selectStateMachine.transition('fill', searchedVariantsWrapper)
    }

    
    async function searchAndSaveElements(name, placeToSave) {
        let searchedElements = await searchElements(name)
        searchedElements.forEach((element) => {
            placeToSave.add(element)
        })
    }

    // searchElements(name)  GOOD!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    async function searchElements(name) {
        try {
            const response = await fetch(`https://api.hh.ru/suggests/areas?text=${name}`);
            const myJson = await response.json();
            let apiSearchResults = [];
            myJson.items.forEach(item => apiSearchResults.push(item.text));
            return apiSearchResults;
        }
        catch (err) {
            return console.log(err);
        }
    }

    // drawSearchResults()
    // drawSearchResults(RESULT_GLOBAL, searchedVariants, classSelectVariantsElement)
    function drawSearchResults(resultValues, placeToAppend, cssClass) {
        // resultValues.forEach(value => {
        let searchListToAppend = document.createDocumentFragment();
        console.log('draw')
        resultValues.forEach(value => {
            let child = createElementWithClass('div', cssClass);
            child.innerHTML = value;
            searchListToAppend.append(child);
        })
        placeToAppend.append(searchListToAppend);
        placeToAppend.style.height = '90px';
        placeToAppend.parentElement.style.display = 'block'; //element or node?
    }

    // drawEmptyResult(initialStateDiv)
    // drawEmptyResult(searchedVariants, text)
    function drawEmptyResult(placeToAppend, text) {
        initialStateDiv.innerHTML = text
        placeToAppend.style.height = '33px';
        placeToAppend.parentElement.style.display = 'block'; //element or node?
        placeToAppend.append(initialStateDiv);
    }
    function drawEmptyResult(placeToAppend, text) {
        let initialStateDiv = createElementWithClass('div', classSelectVariantsElementEmpty);
        initialStateDiv.innerHTML = text
        placeToAppend.style.height = '33px';
        placeToAppend.parentElement.style.display = 'block'; //element or node?
        placeToAppend.append(initialStateDiv);
    }
    // function drawEmptyResult(placeToAppend, text) {
    //     let initialStateDiv = createElementWithClass('div', classSelectVariantsElementEmpty);
    //     initialStateDiv.innerHTML = 'Type to search';
    //     return (placeToAppend, text) => {
    //         initialStateDiv.innerHTML = text
    //         placeToAppend.style.height = '33px';
    //         placeToAppend.parentElement.style.display = 'block'; //element or node?
    //         placeToAppend.append(initialStateDiv);
    //     }
    // }
    




    // addListenersToSearchResults(currentFocus)
    // addListenersToSearchResults(searchedVariants, selectStateMachine)
    function addListenersToSearchResults(searchResultsDiv, stateMachine) {
        for (let i = 0; i < searchResultsDiv.children.length; i++) {
            searchResultsDiv.children[i].addEventListener('mousedown', result => {
                stateMachine.transition('select', result.target.innerHTML)
            }, false);
            searchResultsDiv.children[i].addEventListener('mousemove', result => {
                stateMachine.context.currentFocus.style.background = SELECT_DEFAULT_COLOR;
                stateMachine.context.currentFocus = result.target;
                stateMachine.context.currentFocus.style.background = SELECT_FOCUS_COLOR;
            }, false);
        }
    }

    // giveFocus(currentFocus)
    // giveFocus(searchedVariants)
    function giveFocus(focusContainer) {
        selectStateMachine.context.currentFocus = focusContainer.firstChild;
        selectStateMachine.context.currentFocus.style.background = SELECT_FOCUS_COLOR;
        console.log('give focus', selectStateMachine.currentFocus)
    }


    function debounce(func, timeDelay) {
        let timeout;
        return (argument) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(argument), timeDelay);
        }
    }

    let debouncedSearchAndAddListeners = debounce(searchAndAddListeners, TIME_DELAY_TO_SEARCH) //?????????????????????


    // selectStateMachine, searchedVariantsWrapper, currentFocus, 
    function keyboardActionsFilledState(event) {
        let currentFocus = selectStateMachine.context.currentFocus
        console.log(currentFocus)
        switch (event.key) {
            case "Escape":
                selectStateMachine.transition('close', searchedVariantsWrapper)
                break
            case "Enter":
                selectStateMachine.transition('select', currentFocus.innerHTML)
                break
            case "ArrowUp":
                event.preventDefault();                
                currentFocus.style.background = SELECT_DEFAULT_COLOR
                if (currentFocus.previousSibling === null) {
                    currentFocus = searchedVariants.lastChild;
                } else {
                    currentFocus = currentFocus.previousSibling;
                }
                currentFocus.style.background = SELECT_FOCUS_COLOR;
                currentFocus.scrollIntoView( {block: 'end', behavior: 'smooth'} )
                break
            case "ArrowDown":
                event.preventDefault();
                currentFocus.style.background = SELECT_DEFAULT_COLOR
                if (currentFocus.nextSibling === null) {
                    currentFocus = searchedVariants.firstChild;
                } else {
                    currentFocus = currentFocus.nextSibling;
                }
                currentFocus.style.background = SELECT_FOCUS_COLOR;
                currentFocus.scrollIntoView( {block: 'end', behavior: 'smooth'} )
                break
            default:
                return
        }
    }
    function keyboardActionsFilledState(event) {
        let currentFocus = selectStateMachine.context.currentFocus
        console.log(currentFocus)
        switch (event.key) {
            case "Escape":
                selectStateMachine.transition('close', searchedVariantsWrapper)
                break
            case "Enter":
                selectStateMachine.transition('select', selectStateMachine.context.currentFocus.innerHTML)
                break
            case "ArrowUp":
                event.preventDefault();                
                selectStateMachine.context.currentFocus.style.background = SELECT_DEFAULT_COLOR
                if (selectStateMachine.context.currentFocus.previousSibling === null) {
                    selectStateMachine.context.currentFocus = searchedVariants.lastChild;
                } else {
                    selectStateMachine.context.currentFocus = selectStateMachine.context.currentFocus.previousSibling;
                }
                selectStateMachine.context.currentFocus.style.background = SELECT_FOCUS_COLOR;
                selectStateMachine.context.currentFocus.scrollIntoView( {block: 'end', behavior: 'smooth'} )
                break
            case "ArrowDown":
                event.preventDefault();
                selectStateMachine.context.currentFocus.style.background = SELECT_DEFAULT_COLOR
                if (selectStateMachine.context.currentFocus.nextSibling === null) {
                    selectStateMachine.context.currentFocus = searchedVariants.firstChild;
                } else {
                    selectStateMachine.context.currentFocus = selectStateMachine.context.currentFocus.nextSibling;
                }
                selectStateMachine.context.currentFocus.style.background = SELECT_FOCUS_COLOR;
                selectStateMachine.context.currentFocus.scrollIntoView( {block: 'end', behavior: 'smooth'} )
                break
            default:
                return
        }
    }


    // selectStateMachine, searchedVariantsWrapper 
    function keyboardActionsEmptyState(event) {
        switch (event.key) {
            case "Escape":
                selectStateMachine.transition('close', searchedVariantsWrapper)
                break
            case "ArrowUp":
                event.preventDefault()
                break
            case "ArrowDown":
                event.preventDefault()
                break
            default:
                break
        }
    }

    // // was working in 23 12
    // // inputField.addEventListener('focus', openState, false) //?????bind??????
    // inputWrapper.addEventListener('click', openState, false) //?????bind??????

    // inputField.addEventListener('blur', closeState, false) //?????bind??????
    // // inputField.addEventListener('click', closeState, false) //?????bind??????
    // inputField.addEventListener('input', makeInputWrap, false)
    // inputField.addEventListener('input', debouncedSearchAndAddListeners, false)

    // // inputWrapper.addEventListener('click', () => {inputField.focus()}, false)





    inputWrapper.addEventListener('mousedown', (event) => {
        if (event.target.lastChild) {
            event.preventDefault()
            event.target.lastChild.focus()
        }
    }, false) //?????bind??????
    inputField.addEventListener('focus', openState, false) //?????bind??????
    inputField.addEventListener('blur', closeState, false) //?????bind??????
    inputField.addEventListener('input', makeInputWrap, false)
    inputField.addEventListener('input', debouncedSearchAndAddListeners, false)



}


export { createSelect };