import { machine, useContext, useState, doMachineAction } from './my-state-machine';
import { apiGetCities } from './api';


function createMachine(select) {
    const selectStateMachine = machine({
        initialState: 'closed',
        context: { 
            textInSearchList: '', 
            searchResults: [], 
            selectedVariants: [], 
        },
        states: {
            'empty': {
                onEntry: 'enterEmptyListState',
                on: {
                    close: {
                        service: () => {
                            doMachineAction('close');
                        },
                    },
                    open: {
                        service: (outputText) => {
                            doMachineAction('open', outputText);
                        }
                    },
                    clear: {
                        service: (element) => {
                            doMachineAction('clear', element);
                        },
                    },
                    clearAll: {
                        service: () => {
                            doMachineAction('clearAll');
                        },
                    },
                    fill: {
                        service: (searchedResults) => {
                            doMachineAction('fill', searchedResults);
                        },
                    },
                    search: {
                        service: async (inputText) => {
                            const [state, setState] = useState();
                            const [context, setContext] = useContext();
                            let searchResults = await apiGetCities(inputText);
                            if (state() === 'closed') {
                                return;
                            }
                            searchResults = searchResults.filter((item) => {
                                return !context.selectedVariants.includes(item);
                            })
                            setContext({searchResults});
                            setContext({textInSearchList: 'Type to search...'});
                            if (!searchResults.length) {
                                setContext( {textInSearchList: 'Nothing found'});
                                setState('empty');
                                return;
                            }
                            setState('filled');
                        },
                    },
                },
            },
            'closed': {
                onEntry: 'enterClosedListState',
                on: {
                    close: {},
                    open: {
                        service: (outputText) => {
                            doMachineAction('open', outputText);
                        },
                    },
                    clear: {
                        service: (element) => {
                            doMachineAction('clear', element);
                        },
                    },
                    clearAll: {
                        service: () => {
                            doMachineAction('clearAll');
                        },
                    },
                    fill: {
                        service: (searchedResults) => {
                            doMachineAction('fill', searchedResults);
                        },
                    },
                },
            },
            'filled': {
                onEntry: 'enterFilledListState',
                on: {
                    close: {
                        service: () => {
                            doMachineAction('close');
                        },
                    },
                    open: {
                        service: (outputText) => {
                            doMachineAction('open', outputText);
                        },
                    },
                    clear: {
                        service: (element) => {
                            doMachineAction('clear', element);
                        },
                    },
                    clearAll: {
                        service: () => {
                            doMachineAction('clearAll');
                        },
                    },
                    select: {
                        service: () => {
                            let selectedElement = select.currentFocus.textContent;
                            const [state, setState] = useState();
                            const [context, setContext] = useContext();
                            select.selectResult(selectedElement);
                            select.selectedResults[select.selectedResults.length - 1].lastChild.addEventListener('mousedown', (event) => {
                                selectStateMachine.transition('clear', event.target);
                            });
                            setContext({selectedVariants: [...context.selectedVariants, selectedElement]});
                            select.setInputValue('');
                            setState('empty');
                        },
                    },
                    fill: {
                        service: (searchedResults) => {
                            doMachineAction('fill', searchedResults);
                        },
                    },
                    moveFocusUp: {
                        service: () => {
                            select.moveFocusUp();
                        },
                    },
                    moveFocusDown: {
                        service: () => {
                            select.moveFocusDown();
                        },
                    },
                },
            },
        },
        actions: {
            enterEmptyListState: () => {
                const context = useContext()[0];
                select.deleteSearchResults();
                select.drawEmptyResult(context.textInSearchList);
                select.setInputFocus('focus');
            },
            enterClosedListState: () => {
                const [context, setContext] = useContext();
                select.hideSearchedVariantsWrapper();
                select.deleteSearchResults();
                setContext({searchResults: []});
                select.setInputValue('');
                select.setInputFocus('blur');
            },
            enterFilledListState: () => {
                const context = useContext()[0];
                select.deleteSearchResults();
                select.drawResultsAddListeners(context.searchResults, result => {selectStateMachine.transition('select', result.target.innerHTML)});
                select.giveInitialFocus();
            },

            close: () => {
                const [_, setState] = useState();
                setState('closed');
            },
            open: (outputText) => {
                const [_, setState] = useState();
                const [context, setContext] = useContext();
                setContext({textInSearchList: outputText});
                setState('empty');
            },
            clear: (element) => {
                const [context, setContext] = useContext();
                const [state, setState] = useState();
                setContext({selectedVariants: context.selectedVariants.filter(item => item !== element.parentElement.textContent)});
                select.deleteSelectedResult(element.parentElement);
                select.setInputValue('');
                setContext({textInSearchList: 'Type to search...'});
                setState('empty');
            },
            clearAll: () => {
                const [context, setContext] = useContext();
                const [state, setState] = useState();
                setContext({selectedVariants: []});
                select.deleteSelectedResult();
                select.setInputValue('');
                setState('empty');
            },
            fill: (searchResults) => {
                const [state, setState] = useState();
                const [_, setContext] = useContext();
                setContext({searchResults});
                setState('filled');
            },
        },
    });
    return selectStateMachine;
}

export { createMachine };