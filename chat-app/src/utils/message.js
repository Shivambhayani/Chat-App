const generateMessage = (Username, text) => {
    return {
        Username,
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocationurl = (Username, url) => {
    return {
        Username,
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = { generateMessage, generateLocationurl }