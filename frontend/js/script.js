//login elements
const login = document.querySelector(".login");
const loginForm = document.querySelector(".login__form");
const loginInput = document.querySelector(".login__input");

//chat elements
const chat = document.querySelector(".chat");
const chatForm = document.querySelector(".chat__form");
const chatInput = document.querySelector(".chat__input");
const chatMessages = document.querySelector(".chat__messages");

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold",
    "mediumseagreen",
    "steelblue",
    "orchid",
    "tomato",
    "slategray",
    "teal",
    "deepskyblue",
    "coral",
    "mediumaquamarine",
    "royalblue",
    "sandybrown",
    "palevioletred",
    "mediumslateblue",
    "seagreen",
    "indianred",
    "dodgerblue",
    "darkseagreen",
    "darkorange",
    "mediumvioletred",
    "darkslategray",
    "mediumspringgreen"
];

const user = {
    id: "",
    name: "",
    color: "",

}

let websocket

const getStoredUsername = () => {
    const storedUsername = localStorage.getItem("chatUsername");
    return storedUsername ? storedUsername : "";
};

const getStoredMessages = () => {
    const storedMessages = localStorage.getItem("chatMessages");
    return storedMessages ? JSON.parse(storedMessages) : [];
};

const saveMessagesToStorage = (messages) => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
};

const displayStoredMessages = () => {
    const storedMessages = getStoredMessages();
    storedMessages.forEach((message) => {
        const { userId, userName, userColor, content } = message;
        const displayedMessage = userId === user.id
            ? createmessageSelfElement(content)
            : createmessageOtherElement(content, userName, userColor);
        chatMessages.appendChild(displayedMessage);
    });
    scrollScreen();
};

const createmessageSelfElement = (content) =>
{
    const div = document.createElement("div");

    div.classList.add("message--self");
    div.innerHTML = content;

    return div;
}

const createWelcomeMessage = (userName) => {
    const div = document.createElement("div");

    div.classList.add("message--welcome");
    div.innerHTML = `Olá, <strong>${userName}</strong>!, seja Bem-Vind(o/a/e) ao chat!`;

    div.style.textAlign = "center";
    div.style.padding = "10px";
    div.style.backgroundColor = "#f0f0f0";
    div.style.color = "#333";
    div.style.borderRadius = "10px";
    div.style.margin = "auto";
    div.style.marginTop = "20px";
    div.style.maxWidth = "400px";

    return div;
}


const createmessageOtherElement = (content, sender, senderColor) =>
{
    const div = document.createElement("div");
    const span = document.createElement("span");

    
    div.classList.add("message-other");
    div.classList.add("message--self");
    span.classList.add("message--sender");

    span.style.color = senderColor;

    div.appendChild(span);

    span.innerHTML = sender;
    div.innerHTML += content;

    return div;
}

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const processMessage = ({data}) => {

    const {userId, userName, userColor, content} = JSON.parse(data);

    const message = userId == user.id 
    ? createmessageSelfElement(content)
    : createmessageOtherElement(content, userName, userColor);

    chatMessages.appendChild(message);

    scrollScreen();
}


const handleLogin = (event) => {
    event.preventDefault();

    user.id = crypto.randomUUID();
    user.name = loginInput.value || getStoredUsername(); 
    user.color = getRandomColor();


    window.addEventListener("beforeunload", () => {
        localStorage.setItem("chatUsername", user.name);
    });

    login.style.display = "none";
    chat.style.display = "flex";

    websocket = new WebSocket("ws://webbchat-beckend.onrender.com");
    websocket.onmessage = processMessage;

    const welcomeMessage = createWelcomeMessage(user.name);
    chatMessages.appendChild(welcomeMessage);

    displayStoredMessages();
};

const sendMessage = (event) => {
    event.preventDefault();

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value,
    };

    const storedMessages = getStoredMessages();
    storedMessages.push(message);
    saveMessagesToStorage(storedMessages);

    websocket.send(JSON.stringify(message));

    chatInput.value = "";
};



loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);
