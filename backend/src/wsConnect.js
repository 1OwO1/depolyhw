import { UserModel, MessageModel, ChatBoxModel } from "../models/chatbox";

import { Message } from "../models/message";
const sendData = (data, ws) => {
  ws.send(JSON.stringify(data));
};

const sendStatus = (payload, ws) => {
  sendData(["status", payload], ws);
};

const chatBoxes = {};

const makeName = (name, to) => {
  return [name, to].sort().join("_");
};

const validateUser = async (name) => {
  console.log("finding..." + name);
  const existing = await UserModel.findOne({ name });
  if (existing) return existing;
  if (!existing) {
    const newfriend = await new UserModel({ name: name }).save();
    return newfriend;
  }
};
const validateChatBox = async (name, participants, me, friend) => {
  let box = await ChatBoxModel.findOne({ name });
  if (!box) {
    box = await new ChatBoxModel({
      name: name,
      users: participants,
    }).save();
    const boxId = box._id;
    await UserModel.updateOne(
      { _id: participants[1] },
      { $set: { chatBoxes: [...friend.chatBoxes, boxId] } }
    );
    await UserModel.updateOne(
      { _id: participants[0] },
      { $set: { chatBoxes: [...me.chatBoxes, boxId] } }
    );
  }
  await box.populate(["users", { path: "messages", populate: "sender" }]);
  return;
};
const validateMessage = async (chatboxname, me, message) => {
  let box = await ChatBoxModel.findOne({ name: chatboxname });
  const boxId = box._id;
  let send = await UserModel.findOne({ name: me });
  const sendId = send._id;
  let msg = await new MessageModel({
    chatBox: boxId,
    sender: sendId,
    body: message,
  }).save();
  await msg.populate("chatBox");
  await msg.populate("sender");
  await ChatBoxModel.updateOne(
    { _id: boxId },
    { $set: { messages: [...box.messages, msg._id] } }
  );
  return;
};
/*const updateChatboxUser = (newchatbox, participants) => {
  a=participants[0]
  a.chatBoxes.push(newchatbox._id)
};*/
const initChatBox = async (name, ws) => {
  let box = await ChatBoxModel.findOne({ name });
  if (!box) return;
  await box.populate("messages");
  await box.populate({ path: "messages", populate: "sender" });
  let payload = box.messages.map((msg) => {
    return { name: msg.sender.name, body: msg.body };
  });
  sendData(["CHAT", payload], ws);

  //sendData(["CHAT", payload], ws);
};

/*const broadcastMessage = (wss, data, status) => {
  wss.clients.forEach((client) => {
    sendData(data, client);
    sendStatus(status, client);
  });
};*/
export default {
  // broadcastMessage:,

  //load message in DB
  initData: (ws) => {
    Message.find()
      .sort({ created_at: -1 })
      .limit(100)
      .exec((err, res) => {
        if (err) throw err;
        sendData(["init", res], ws);
      });
  },

  onMessage: (ws) => async (byteString) => {
    const { data } = byteString; //byteString => the message you get
    const { type, payload } = JSON.parse(data);
    //JSON.parse() change string to object
    let chatBoxName = makeName(payload.name, payload.to);

    switch (type) {
      case "CHAT": {
        const { name, to } = payload;
        if (ws.box !== "" && chatBoxes[ws.box]) {
          //user(ws) was in another chatbox
          chatBoxes[ws.box].delete(ws);
        }
        ws.box = chatBoxName; //chatBoxName=task.to
        if (!chatBoxes[chatBoxName]) {
          //make new record for chatbox
          chatBoxes[chatBoxName] = new Set();
        }
        chatBoxes[chatBoxName].add(ws); //add this open connection into chatbox

        const participants = await validateUser(name);
        const participants2 = await validateUser(to);
        const a = [participants._id, participants2._id];
        validateChatBox(chatBoxName, a, participants, participants2);
        initChatBox(chatBoxName, ws);
        break;
      }
      case "MESSAGE": {
        const { name, to, body } = payload;
        validateMessage(chatBoxName, name, body);
        chatBoxes[chatBoxName].forEach((element) => {
          sendData(["MESSAGE", { name: name, body: body }], element);
        });
        break;
      }
      case "CLEAR": {
        const { name, to } = payload;
        break;
      }

      /*case "input": {
        const { name, body } = payload;
        //Save payload to DB
        const message = new Message({ name, body });
        try {
          //message.save() save object into mongoDB
          await message.save();
        } catch (e) {
          throw new Error("Message DB save error:" + e);
        }
        //Respond to client
        sendData(["output", [payload]], ws);
        sendStatus({ type: "success", msg: "Message sent." }, ws);
        /*broadcastMessage(["output", [payload]], {
          type: "success",
          msg: "Message sent.",
        });
        have error in broadcast QAQ
        break;
      }
      case "clear":
        Message.deleteMany({}, () => {
          sendData(["cleared"], ws);
          sendStatus({ type: "info", msg: "Message cache cleared." }, ws);
        });
        break;*/
      default:
        break;
    }
  },
};
