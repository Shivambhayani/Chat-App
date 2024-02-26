//  server - side

const socket = io();
// const { generateMessage } = require('../../src/utils/message')
// dom elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationbtn = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplates = document.querySelector('#message-template').innerHTML
const locationTemplates = document.querySelector('#location-template').innerHTML
const sidebarTemplates = document.querySelector('#sidebar-template').innerHTML

// options
const { Username, Room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

//  server (emit) => client(receive)  --acknowlegment -->server
//  client (emit) => server(receive)  --acknowlegment -->client

// Autoscroll
const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild;


    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;


    // Visible height
    const visibleHeight = $messages.offsetHeight;


    // Height of messages container
    const containerHeight = $messages.scrollHeight;


    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight;


    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
};

socket.on('message', (message) => {

    const html = Mustache.render(messageTemplates, {
        Username: message.Username,
        message: message.text,
        createdAt: moment(message.createdAt).format('LT')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplates, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
    // $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (message) => {
    // console.log(url);
    const html = Mustache.render(locationTemplates, {
        Username: message.Username,
        url: message.url,
        createdAt: moment(message.createdAt).format('LT')

    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (err) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (err) {
            return console.log(err);
        }
        console.log('Message Delivered !');

    })

})

// location
$locationbtn.addEventListener('click', () => {

    if (!navigator.geolocation) {
        return alert('Allow location')
    }
    $locationbtn.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position);

        socket.emit('sendlocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('Location shared')
            $locationbtn.removeAttribute('disabled')

        })
    })
})

// join room
socket.emit('join', { Username, Room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/';
    }
})




// socket.on('countUpdate', (count) => {
//     console.log('The count updated', count);
// })
// document.querySelector('#increment').addEventListener('click', (e) => {
//     e.preventDefault()
//     // console.log('clicked');
//     socket.emit('increment')
// })