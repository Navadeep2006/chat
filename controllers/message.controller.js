const { addMessage, getConversation } = require("../store");

exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = getConversation(req.user.id, userId);

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to fetch messages" });
  }
};

exports.saveMessage = (payload) => {
  return addMessage(payload);
};
