function debounce(func, timeDelay) {
    let timeout;
    return (argument) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(argument), timeDelay);
    }
}

function createElementWithClass(element, elementClass='') {
    let outputElement = document.createElement(element);
    outputElement.className = elementClass;
    return outputElement;
}

export { debounce, createElementWithClass };