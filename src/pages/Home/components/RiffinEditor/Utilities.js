import { DEFAULT_BLOCK_COLS, MIN_BLOCK_COLS, MAX_BLOCK_COLS, MOVEMENT_KEYS } from './EditorConfig'

const calcNewMaxLength = (numberOfCols, numberOfStrings) => (numberOfCols * numberOfStrings) + (numberOfStrings * 2) - 1
const calculateNewFirstCol = (numberOfCols, index) => (numberOfCols + 1) * (index)
const calculateNewLastCol = (numberOfCols, stringNum, index) => (numberOfCols * stringNum) + index

/* 
  Needs an actions object with the following properties:
  area
  characterToAdd
  action
  cols,
  stepCount
*/
export const updateBlockValue = (action) => {
  if((action.type === "increase" && action.cols === MAX_BLOCK_COLS) ||
    (action.type === "decrease" && action.cols === MIN_BLOCK_COLS)) {
    return action.area
  }

  const guitarStrings = action.area.split('\n')
  let newValueString = ""
  for(let i = 0; i < guitarStrings.length; i++) {
    const array = [...guitarStrings[i]]
    for(let j = 0; j < Math.abs(action.stepCount); j++) {
      if(action.type === "increase") {
        array[array.length - 1] = action.characterToAdd
        array.push('|')
      } else {
        array.pop()
        array[array.length - 1] = "|"
      }
    }
    if(i !== guitarStrings.length - 1) { // Last string doesn't need a newline char
      array.push("\n")
    }
    newValueString += array.join("")
  }
  return newValueString
}

/* 
  action {
    cols,
    maxLength,
    action,
    stringCount,
    stepCount
  }
*/
export const updateTextAreaAttributes = (action) => {
  if((action.type === "increase" && action.cols === MAX_BLOCK_COLS) ||
    (action.type === "decrease" && action.cols === MIN_BLOCK_COLS)) {
    return {
      cols: action.cols,
      maxLength: action.maxLength
    }
  }

  return {
    cols: action.cols + action.stepCount,
    maxLength: calcNewMaxLength(action.cols + action.stepCount, action.stringCount)
  }

}

export const getMapOfLastColumnIndexes = (action) => {
  const newLastCols = {}
  for(let i = 0; i < action.stringCount; i++) {
    const stringNum = i + 1
    const newVal = calculateNewLastCol(action.cols, stringNum, i)
    newLastCols[newVal] = true
  }
  return newLastCols
}

export const getMapOfFirstColumnIndexes = (action) => {
  const newFirstCols = {}
  for(let i = 0; i < action.stringCount; i++) {
    const newVal = calculateNewFirstCol(action.cols, i)
    newFirstCols[newVal] = true
  }
  return newFirstCols
}

// TODO Rename to createNewBlock
export const getNewGuitarBlock = (stringCount = 6) => {
  const action = {
    stringCount: stringCount,
    cols: DEFAULT_BLOCK_COLS
  }
  const mapOfFirstColumnIndexes = getMapOfFirstColumnIndexes(action)
  const mapOfLastColumnIndexes = getMapOfLastColumnIndexes(action)
  const mapOfSecondToLastColumnIndexes = Object.keys(mapOfLastColumnIndexes).map((val) => val - 1)
  console.log(mapOfSecondToLastColumnIndexes)
  const initLength = (action.stringCount * action.cols) + (action.stringCount - 1)
  const initTextAreaWithValue = (character) => {
    let charactersInString = [];
    for (let i = 0; i < initLength; i++) {
      if (i in mapOfLastColumnIndexes) {
        charactersInString.push("\n");
      } else if (i in mapOfFirstColumnIndexes || mapOfSecondToLastColumnIndexes.includes(i)) {
        charactersInString.push("|");
      } else {
        charactersInString.push(character);
      }
    }
    return charactersInString.join("");
  };
  const inputs = initTextAreaWithValue(" ")
  const dashes = initTextAreaWithValue("-")
  const maxLength = calcNewMaxLength(action.cols, action.stringCount)
  return {
    tempKey: Date() + Math.random(),
    inputs: inputs,
    dashes: dashes,
    cols: DEFAULT_BLOCK_COLS,
    maxLength: maxLength,
    numberOfStrings: stringCount
  };
}

// Duplication 

const getPositionsAboveCursor = (cursorPosition, cols) => {
  let arrayOfPositions = []
  const indexGapBetweenStrings = cols + 1 // The + 1 compensates for the hidden \n
  for(let position = cursorPosition - indexGapBetweenStrings; position >= 0; position -= indexGapBetweenStrings) {
    arrayOfPositions.push(position - 1)
  }
  return arrayOfPositions
}

const getPositionsBelowCursor = (cursorPosition, cols, editableLength) => {
  const indexGapBetweenStrings = cols + 1 // The + 1 compensates for the hidden \n
  let arrayOfPositions = []
  for(let position = cursorPosition + indexGapBetweenStrings; position <= editableLength; position += indexGapBetweenStrings) {
    arrayOfPositions.push(position - 1)
  }
  return arrayOfPositions
}

export const getPositionsToDuplicate = (cursorPosition, cols, editableLength) => {
  let aboveCursor = getPositionsAboveCursor(cursorPosition, cols)
  let belowCursor = getPositionsBelowCursor(cursorPosition, cols, editableLength)
  let positions = [cursorPosition - 1, ...aboveCursor, ...belowCursor]
  // let gridValuesArray = [...inputGrid.value]
  // positions = positions.filter(position => gridValuesArray[position] !== ' ')
  return positions
}

/**
 * Creates the initial tablature object for a new tab
 * @param {number} numberOfStrings 
 * @returns a tablature object
 */
export const createTablatureTemplateObject = (numberOfStrings) => {
  const initialBlock = getNewGuitarBlock(numberOfStrings);
  return {
    name: "A tasty lick",
    blocks: [initialBlock],
    tags: [],
    numberOfStrings
  }
}

export const updateSelectedBlock = (blockIndex, blockRef) => {
  return { inputRef: blockRef, index: blockIndex }
}

export const updateCursorPosition = (selectionStart) => {
  return { position: selectionStart }
}

export const isMovementKey = (key) => (key in MOVEMENT_KEYS)