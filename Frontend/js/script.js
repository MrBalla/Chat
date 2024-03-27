
//Login
const login=document.querySelector(".login");
const loginForm=login.querySelector(".login_form");
const loginInput=login.querySelector(".login_name");


//Chat
const chat=document.querySelector(".chat");
const chatForm=chat.querySelector(".chat_form");
const chatInput=chat.querySelector(".chat_input");
const chatMessages=chat.querySelector(".chat_messages");


const colors=[
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold",
    "burlywood",
    "crimson"
];

const user={id: "", name: "", color: "" };
let websocket;

const createMessageSelfElement=(content)=>{
    const div= document.createElement("div");
    div.classList.add("messages-self");
    div.innerHTML=content;

    return div;
}
const createMessageOtherElement=(content, sender, senderColor)=>{

    const div= document.createElement("div");
    const span= document.createElement("span");

    div.classList.add("messages-other");
    span.classList.add("message-sender");
    span.style.color = senderColor;

    div.appendChild(span)

    span.innerHTML= sender;


    div.innerHTML+=content;

    return div;
}




const getColor=()=>{
    const randomNumber=Math.floor(Math.random()*colors.length);
    return colors[randomNumber];
}

const scrollScreen=()=>{
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const processMessage = ({data}) =>{
   const{userId, userName, userColor, content}=JSON.parse(data);
   
   const message = 
        userId === user.id
            ? createMessageSelfElement(content)
            : createMessageOtherElement(content, userName, userColor);
            
  chatMessages.appendChild(message);
  scrollScreen();
}

const handleSubmit = (event)=>{
    event.preventDefault();

    user.id=crypto.randomUUID();
    user.name=loginInput.value;
    user.color=getColor();

    login.style.display="none";
    chat.style.display="flex";
    
    websocket= new WebSocket("ws://localhost:8080");
    websocket.onmessage = processMessage;

}

const sendMessage = (event)=>{
    event.preventDefault();
    const message={
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

   websocket.send(JSON.stringify(message))
    chatInput.value=""
}

loginForm.addEventListener("submit", handleSubmit);
chatForm.addEventListener("submit", sendMessage);




