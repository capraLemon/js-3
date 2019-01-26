import './styles.css';
import { CSS_STYLES, COLORS } from './consts';
import { createElementWithClass } from './helpers';


class Select {
    constructor(userSelectWrapper) {
        this.userSelectWrapper = userSelectWrapper;

        this.selectContainer = createElementWithClass('div', CSS_STYLES.selectContainer);
        this.selectControl = createElementWithClass('div', CSS_STYLES.selectControl); //name of varioable!!!!!!!!!!!!!!!
        this.inputWrapper = createElementWithClass('div', CSS_STYLES.inputWrapper);
        this.inputField = createElementWithClass('input', CSS_STYLES.inputField);
        this.clearIcon = createElementWithClass('div', CSS_STYLES.clearIcon + ' ' + CSS_STYLES.fas + ' ' + CSS_STYLES.faTimes + ' ' + CSS_STYLES.controlClearIcon);
        this.inputField.placeholder = 'Select...';
        this.searchedVariantsWrapper = createElementWithClass('div', CSS_STYLES.searchedVariantsWrapper);
        this.searchedVariants = createElementWithClass('div', CSS_STYLES.searchedVariants);

        this.inputWrapper.append(this.inputField);
        this.selectControl.append(this.inputWrapper);
        this.selectControl.append(this.clearIcon);
        this.searchedVariantsWrapper.append(this.searchedVariants);
        this.selectContainer.append(this.selectControl);
        this.selectContainer.append(this.searchedVariantsWrapper);
        this.userSelectWrapper.append(this.selectContainer);

        this.selectedResultsIcons = [];
        this.selectedResults = [];
    }

    onInput(eventHandler) {
        this.inputField.addEventListener('input', eventHandler);
    }

    onMousedown(eventHandler) {
        this.selectContainer.addEventListener('mousedown', eventHandler);
    }

    onMousedownInput(eventHandler) {
        this.inputField.addEventListener('mousedown', eventHandler);
    }

    onClick(eventHandler) {
        this.selectContainer.addEventListener('click', eventHandler);
    }
    
    onFocus(eventHandler) {
        this.inputField.addEventListener('focus', eventHandler);
    }

    onBlur(eventHandler) {
        this.inputField.addEventListener('blur', eventHandler);
    }

    onKeydown(eventHandler) {
        this.inputField.addEventListener('keydown', eventHandler);
    }

    onClear(eventHandler) {
        this.clearIcon.addEventListener('mousedown', eventHandler);
    }

    deleteSearchResults() {
        while (this.searchedVariants.hasChildNodes()) {
            this.searchedVariants.removeChild(this.searchedVariants.lastChild);
        }
    }

    drawEmptyResult(text) {
        let initialStateDiv = createElementWithClass('div', CSS_STYLES.selectVariantsElementEmpty);
        initialStateDiv.innerHTML = text;
        this.searchedVariants.style.height = '33px';
        this.searchedVariantsWrapper.style.display = 'block';
        this.searchedVariants.append(initialStateDiv);
    }

    drawResultsAddListeners(resultValues, handler) {
        let searchListToAppend = document.createDocumentFragment();
        resultValues.forEach(value => {
            let child = createElementWithClass('div', CSS_STYLES.selectVariantsElement);
            child.innerHTML = value;
            searchListToAppend.append(child);

            child.addEventListener('mousedown', handler, false);
            child.addEventListener('mousemove', result => {
                this.currentFocus.style.background = COLORS.selectDefaultColor;
                this.currentFocus = result.target;
                this.currentFocus.style.background = COLORS.selectFocusColor;
            }, false);
        })
        this.searchedVariants.append(searchListToAppend);
        this.searchedVariants.style.height = '90px';
        this.searchedVariantsWrapper.style.display = 'block';
    }

    selectResult(selectedElement) {
        let icon = createElementWithClass('div', CSS_STYLES.clearIcon + ' ' + CSS_STYLES.fas + ' ' + CSS_STYLES.faTimes);
        let selectedElementDiv = createElementWithClass('div', CSS_STYLES.selectedElement);
        selectedElementDiv.innerHTML = selectedElement;
        selectedElementDiv.append(icon);
        this.inputWrapper.insertBefore(selectedElementDiv, this.inputField);

        this.selectedResults.push(selectedElementDiv);
        this.clearIcon.style.display = 'flex';
    }

    deleteSelectedResult(selectedResult) {
        if (selectedResult) {
            this.inputWrapper.removeChild(selectedResult);

            let position = this.selectedResults.indexOf(selectedResult);
            this.selectedResults.splice(position, 1);
        } else {
            let allSelectedResults = this.inputWrapper.childElementCount - 1;
            for (let index = 0; index < allSelectedResults; index++) {
                this.inputWrapper.removeChild(this.inputWrapper.firstChild);
            }
            this.selectedResults = [];
        }
        if (!this.selectedResults.length) {
            this.clearIcon.style.display = 'none';
        }
    }

    setInputValue(string) {
        this.inputField.value = string;
    }

    setInputFocus(focusState) {
        this.inputField[focusState]();
    }

    hideSearchedVariantsWrapper() {
        this.searchedVariantsWrapper.style.display = 'none';
    }

    giveInitialFocus() {
        this.currentFocus = this.searchedVariants.firstChild;
        this.currentFocus.style.background = COLORS.selectFocusColor;
    }

    moveFocusUp() {
        this.currentFocus.style.background = COLORS.selectDefaultColor;
        if (this.currentFocus.previousSibling === null) {
            this.currentFocus = this.currentFocus.parentNode.lastChild;
        } else {
            this.currentFocus = this.currentFocus.previousSibling;
        }
        this.currentFocus.style.background = COLORS.selectFocusColor;
        this.currentFocus.scrollIntoView({block: 'end', behavior: 'smooth'});
    }

    moveFocusDown() {
        this.currentFocus.style.background = COLORS.selectDefaultColor;
        if (this.currentFocus.nextSibling === null) {
            this.currentFocus = this.currentFocus.parentNode.firstChild;
        } else {
            this.currentFocus = this.currentFocus.nextSibling;
        }
        this.currentFocus.style.background = COLORS.selectFocusColor;
        this.currentFocus.scrollIntoView({block: 'end', behavior: 'smooth'});
    }
}

export { Select };