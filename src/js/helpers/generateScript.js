const generateScript = ({ scriptName, description, args, localVars, options }) => {

  let newOutput = ''

  let headFunction =      ''
  let headDescription =   ''
  let headArgumentTypes = []
  let headArgumentNames = []
  let headArgumentDescs = []

  let declArguments = []
  let declLocals = ''

  // Determine how much padding is need between tags and description based on which
  // tags are used
  let funcTagLength = scriptName !== '' ? options.functionTag.length : 0
  let descTagLength = description !== '' ? options.descriptionTag.length : 0
  let argTagLength = args.length > 0 ? options.argumentTag.length : 0

  let tagPadLength = Math.max(funcTagLength, descTagLength, argTagLength) + 2

  if (options.legacyMode) {
    headFunction =    '/// '
    headDescription = `//\xa0\xa0${description}`
  } else {
    headFunction =      `/// ${options.functionTag}${'\xa0'.repeat(Math.max(2,tagPadLength-funcTagLength))}`
    headDescription =   `/// ${options.descriptionTag}${'\xa0'.repeat(Math.max(2,tagPadLength-descTagLength))}${description}`
  }

  // Create script JSDoc header

  // Script name
  if (scriptName !== '') {
    let hasArgs = false
    headFunction += `${scriptName}(`

    for (let i = 0; i < args.length; i++) {
      if (args[i].name !== '') {
        headFunction += `${args[i].name}, `
        hasArgs = true
      }
    }

    // Strip trailing comma
    if (hasArgs) {
      headFunction = headFunction.slice(0,headFunction.length-2)
    }

    headFunction += ')'
  }

  // Arguments
  let currentArgIndex = 0

  // find the length of longest type and argument names for spacing purposes
  let typeMaxLength = -3
  let nameMaxLength = 0

  for (let i = 0; i < args.length; i++) {
    if (args[i].type && args[i].type.length > typeMaxLength) {
      typeMaxLength = args[i].type.length
    }

    if (args[i].name && args[i].name.length > nameMaxLength) {
      nameMaxLength = args[i].name.length
    }
  }

  for (let i = 0; i < args.length; i++) {

    // Build JSDoc line
    if (args[i].name !== '') {

      if (!options.legacyMode) {
        if (args[i].type !== '') {
          let spaceBufferSize = Math.max(0,typeMaxLength-args[i].type.length)
          headArgumentTypes.push(` {${args[i].type}}${'\xa0'.repeat(spaceBufferSize)}`)
        } else {
          headArgumentTypes.push('\xa0'.repeat(typeMaxLength+3))
        }

        if (args[i].name !== '') {
          let spaceBufferSize = Math.max(0,nameMaxLength-args[i].name.length)
          headArgumentNames.push(`${args[i].name}${'\xa0'.repeat(spaceBufferSize)}`)
        } else {
          headArgumentNames.push('\xa0'.repeat(nameMaxLength))
        }
  
        if (args[i].description !== '') {
          headArgumentDescs.push(` ${args[i].description}`)
        } else {
          headArgumentDescs.push('')
        }
      }

      // Build declaration line
      let declArg = `var ${options.localVarPrefix}${args[i].name} = argument[${currentArgIndex}];`
      const declArgPad = nameMaxLength - args[i].name.length + 2

      if (options.legacyMode && args[i].description) {
        declArg += `${'\xa0'.repeat(declArgPad)}// ${args[i].description}`
      }

      declArguments.push(`${declArg}\n`)
      currentArgIndex++
    }
  }

  // Additional local variables
  for (let i = 0; i < localVars.length; i++) {
    if (localVars[i].name !== '') {
      declLocals += `${options.localVarPrefix}${localVars[i].name}, `
    }
  }

  // Strip trailing comma
  if (localVars.length > 0) {
    declLocals = declLocals.slice(0,declLocals.length-2)
  }

  // Build Script
  // ------------

  let firstLine = true

  // @function
  if (scriptName !== '') {
    newOutput += `${headFunction}\n`
    firstLine = false
  }

  // @description
  if (description !== '') {
    newOutput += `${headDescription}\n`
    firstLine = false
  }

  // @param
  if (!options.legacyMode) {
    for (let i = 0; i < headArgumentNames.length; i++) {
      newOutput += `/// ${options.argumentTag}${'\xa0'.repeat(tagPadLength-argTagLength-1)}${headArgumentTypes[i]} ${headArgumentNames[i]} ${headArgumentDescs[i]}\n`
    }

    if (headArgumentNames.length > 0) {
      firstLine = false
    }
  }

  if (declArguments.length > 0 && !firstLine) {
    newOutput += '\n'
  }

  // argument declarations
  for (let i = 0; i < declArguments.length; i++) {
    newOutput += declArguments[i]
    firstLine = false
  }

  // local var declarations
  if (declLocals !== '') {
    if (!firstLine) {
      newOutput += '\n'
    }

    newOutput += `var ${declLocals};\n`
    firstLine = false
  }

  if (newOutput !== '' && !firstLine) {
    newOutput += '\n'
  }

  newOutput += '/* Script body goes here */'

  return newOutput
}

export default generateScript