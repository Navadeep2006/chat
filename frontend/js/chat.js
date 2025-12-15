const socket = io("http://localhost:5000");

const userId = localStorage.getItem("userId");
const token = localStorage.getItem("token");

if (!userId || !token) window.location.href = "index.html";

socket.emit("join", userId);

let currentFriend = localStorage.getItem("friendId") || null;
let currentFriendName = localStorage.getItem("friendName") || null;

if (currentFriend) {
  document.getElementById("friendIdInput").value =
    currentFriendName || currentFriend;
  setChatWith(currentFriendName || currentFriend);
  loadMessages();
}

socket.on("receiveMessage", (msg) => {
  const isForMe =
    (msg.senderId === currentFriend && msg.receiverId === userId) ||
    (msg.senderId === userId && msg.receiverId === currentFriend);

  if (isForMe) {
    showMessage(msg);
  }
});

async function setFriend() {
  const friendId = document.getElementById("friendIdInput").value.trim();
  await setFriendInternal(friendId);
}

async function setFriendFromDemo(username) {
  // Demo usernames can be used directly as friendId if you store them that way
  document.getElementById("friendIdInput").value = username;
  await setFriendInternal(username);
}

async function setFriendInternal(friendId) {
  if (!friendId) return;
  const resolved = await resolveFriend(friendId);
  if (!resolved) return;

  currentFriend = resolved.userId;
  currentFriendName = resolved.username;
  localStorage.setItem("friendId", currentFriend);
  localStorage.setItem("friendName", currentFriendName);
  setChatWith(currentFriendName || currentFriend);
  clearMessages();
  await loadMessages();
}

async function loadMessages() {
  if (!currentFriend) return;
  try {
    const msgs = await apiCall(`messages/${currentFriend}`, "GET", null, token);
    clearMessages();
    msgs.forEach((m) => showMessage(m, m.senderId === userId));
  } catch (err) {
    console.error(err);
  }
}

function sendMessage() {
  if (!currentFriend) {
    alert("Set a friend userId first.");
    return;
  }

  const input = document.getElementById("messageInput");
  const content = input.value.trim();

  if (!content) return;

  const msg = {
    senderId: userId,
    receiverId: currentFriend,
    content
  };

  socket.emit("sendMessage", msg);
  showMessage(msg, true);
  input.value = "";
}

function showMessage(msg, me = false) {
  const div = document.createElement("div");
  div.className = "message " + (me ? "me" : "them");
  div.innerText = msg.content;
  document.getElementById("messages").appendChild(div);
  div.scrollIntoView({ behavior: "smooth", block: "end" });
}

function clearMessages() {
  document.getElementById("messages").innerHTML = "";
}

function setChatWith(friendId) {
  const label = document.getElementById("chatWith");
  if (label) label.innerText = friendId ? friendId : "Select a friend";
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

async function resolveFriend(identifier) {
  try {
    const data = await apiCall(
      `auth/user/${encodeURIComponent(identifier)}`,
      "GET",
      null,
      token
    );
    if (data && data.userId) {
      return data;
    }
    alert("User not found");
    return null;
  } catch (err) {
    console.error(err);
    alert("Unable to find user");
    return null;
  }
}
